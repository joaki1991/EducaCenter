import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthRequest, getCompanyId } from '../middleware/auth.js';
import { createAuditLog } from '../utils/audit.js';
import { hashPassword } from '../utils/password.js';

const createEmployeeSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)).optional(),
  workCenter: z.string().optional(),
});

const updateEmployeeSchema = z.object({
  startDate: z.string().transform((val) => new Date(val)).optional(),
  endDate: z.string().transform((val) => new Date(val)).optional(),
  workCenter: z.string().optional(),
  active: z.boolean().optional(),
});

export const createEmployee = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only COMPANY_ADMIN can create employees
    if (
      request.user.role !== 'COMPANY_ADMIN' &&
      request.user.role !== 'SUPER_ADMIN'
    ) {
      reply.status(403).send({ error: 'Forbidden: Only admins can create employees' });
      return;
    }

    const body = createEmployeeSchema.parse(request.body);
    const companyId = getCompanyId(request);

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      // Check if already employee of this company
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          userId: user.id,
          companyId,
        },
      });

      if (existingEmployee) {
        reply.status(400).send({ error: 'User is already an employee of this company' });
        return;
      }
    } else {
      // Create new user
      const passwordHash = await hashPassword(body.password);
      user = await prisma.user.create({
        data: {
          email: body.email,
          passwordHash,
          role: 'EMPLOYEE',
        },
      });
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        companyId,
        startDate: body.startDate,
        endDate: body.endDate,
        workCenter: body.workCenter,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            active: true,
          },
        },
      },
    });

    await createAuditLog({
      userId: request.user.userId,
      companyId,
      action: 'CREATE',
      entity: 'Employee',
      entityId: employee.id,
      metadata: { email: body.email, startDate: body.startDate },
    });

    reply.status(201).send({
      success: true,
      employee,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create employee error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getEmployees = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const companyId = getCompanyId(request);

    const employees = await prisma.employee.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            active: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    reply.send({
      success: true,
      employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getEmployee = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { id } = request.params as { id: string };
    const companyId = getCompanyId(request);

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            active: true,
          },
        },
        _count: {
          select: {
            timeEntries: true,
            vacationRequests: true,
          },
        },
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    reply.send({
      success: true,
      employee,
    });
  } catch (error) {
    console.error('Get employee error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const updateEmployee = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only COMPANY_ADMIN can update
    if (
      request.user.role !== 'COMPANY_ADMIN' &&
      request.user.role !== 'SUPER_ADMIN'
    ) {
      reply.status(403).send({ error: 'Forbidden' });
      return;
    }

    const { id } = request.params as { id: string };
    const body = updateEmployeeSchema.parse(request.body);
    const companyId = getCompanyId(request);

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    // Update employee
    const updateData: any = {};
    if (body.startDate) updateData.startDate = body.startDate;
    if (body.endDate) updateData.endDate = body.endDate;
    if (body.workCenter !== undefined) updateData.workCenter = body.workCenter;

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            active: true,
          },
        },
      },
    });

    // If active status changed, update user
    if (body.active !== undefined) {
      await prisma.user.update({
        where: { id: employee.userId },
        data: { active: body.active },
      });
    }

    await createAuditLog({
      userId: request.user.userId,
      companyId,
      action: 'UPDATE',
      entity: 'Employee',
      entityId: id,
      metadata: body,
    });

    reply.send({
      success: true,
      employee: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Update employee error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getEmployeeTimeEntries = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { id } = request.params as { id: string };
    const companyId = getCompanyId(request);
    const { startDate, endDate } = request.query as {
      startDate?: string;
      endDate?: string;
    };

    // Verify employee exists and belongs to company
    const employee = await prisma.employee.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    const whereClause: any = {
      employeeId: id,
      companyId,
    };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = new Date(startDate);
      if (endDate) whereClause.timestamp.lte = new Date(endDate);
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: whereClause,
      orderBy: {
        timestamp: 'desc',
      },
    });

    reply.send({
      success: true,
      timeEntries,
    });
  } catch (error) {
    console.error('Get employee time entries error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
