import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthRequest, getCompanyId } from '../middleware/auth.js';
import { createAuditLog } from '../utils/audit.js';

const createVacationSchema = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
});

const approveRejectSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionNote: z.string().optional(),
});

// Calculate business days excluding weekends and holidays
const calculateBusinessDays = async (
  startDate: Date,
  endDate: Date,
  region: string = 'ES'
): Promise<number> => {
  // Get holidays for the date range
  const holidays = await prisma.holiday.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      region: {
        in: ['ES', region], // Include national and regional holidays
      },
    },
  });

  const holidayDates = new Set(holidays.map((h) => h.date.toISOString().split('T')[0]));

  let businessDays = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const dateStr = currentDate.toISOString().split('T')[0];

    // Skip weekends (0 = Sunday, 6 = Saturday) and holidays
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateStr)) {
      businessDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
};

// Calculate available vacation days for an employee
const calculateAvailableVacationDays = async (
  employeeId: string,
  companyId: string,
  year: number
): Promise<number> => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  const startDate = employee.startDate;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  let totalDays = 22; // Base 22 días laborables

  // If started mid-year, calculate proportional days
  if (startDate > yearStart) {
    const daysInYear = 365;
    const daysWorked = Math.floor(
      (yearEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    totalDays = Math.floor((22 * daysWorked) / daysInYear);
  }

  // Subtract approved vacation days
  const approvedRequests = await prisma.vacationRequest.findMany({
    where: {
      employeeId,
      companyId,
      status: 'APPROVED',
      startDate: {
        gte: yearStart,
      },
      endDate: {
        lte: yearEnd,
      },
    },
  });

  const usedDays = approvedRequests.reduce(
    (sum, req) => sum + req.daysRequested,
    0
  );

  return totalDays - usedDays;
};

export const createVacationRequest = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const body = createVacationSchema.parse(request.body);
    const companyId = getCompanyId(request);

    // Get employee
    const employee = await prisma.employee.findFirst({
      where: {
        userId: request.user.userId,
        companyId,
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    // Validate dates
    if (body.startDate >= body.endDate) {
      reply.status(400).send({ error: 'End date must be after start date' });
      return;
    }

    // Calculate business days
    const businessDays = await calculateBusinessDays(
      body.startDate,
      body.endDate
    );

    if (businessDays === 0) {
      reply.status(400).send({ 
        error: 'Invalid date range',
        message: 'The selected dates do not include any business days',
      });
      return;
    }

    // Check available days
    const year = body.startDate.getFullYear();
    const availableDays = await calculateAvailableVacationDays(
      employee.id,
      companyId,
      year
    );

    if (businessDays > availableDays) {
      reply.status(400).send({
        error: 'Insufficient vacation days',
        message: `You have ${availableDays} days available, but requested ${businessDays} days`,
        availableDays,
        requestedDays: businessDays,
      });
      return;
    }

    // Create vacation request
    const vacationRequest = await prisma.vacationRequest.create({
      data: {
        employeeId: employee.id,
        companyId,
        startDate: body.startDate,
        endDate: body.endDate,
        daysRequested: businessDays,
        status: 'PENDING',
      },
    });

    // Audit log
    await createAuditLog({
      userId: request.user.userId,
      companyId,
      action: 'CREATE',
      entity: 'VacationRequest',
      entityId: vacationRequest.id,
      metadata: {
        startDate: body.startDate,
        endDate: body.endDate,
        daysRequested: businessDays,
      },
    });

    reply.status(201).send({
      success: true,
      vacationRequest,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create vacation request error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getMyVacationRequests = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const companyId = getCompanyId(request);

    // Get employee
    const employee = await prisma.employee.findFirst({
      where: {
        userId: request.user.userId,
        companyId,
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    const requests = await prisma.vacationRequest.findMany({
      where: {
        employeeId: employee.id,
        companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    reply.send({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('Get vacation requests error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getVacationBalance = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const companyId = getCompanyId(request);
    const year = parseInt((request.query as any).year || new Date().getFullYear().toString(), 10);

    // Get employee
    const employee = await prisma.employee.findFirst({
      where: {
        userId: request.user.userId,
        companyId,
      },
    });

    if (!employee) {
      reply.status(404).send({ error: 'Employee not found' });
      return;
    }

    const availableDays = await calculateAvailableVacationDays(
      employee.id,
      companyId,
      year
    );

    reply.send({
      success: true,
      year,
      totalDays: 22,
      availableDays,
      usedDays: 22 - availableDays,
    });
  } catch (error) {
    console.error('Get vacation balance error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const approveRejectVacation = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only COMPANY_ADMIN can approve/reject
    if (request.user.role !== 'COMPANY_ADMIN' && request.user.role !== 'SUPER_ADMIN') {
      reply.status(403).send({ error: 'Forbidden: Only admins can approve/reject vacations' });
      return;
    }

    const { id } = request.params as { id: string };
    const body = approveRejectSchema.parse(request.body);
    const companyId = getCompanyId(request);

    // Get vacation request
    const vacationRequest = await prisma.vacationRequest.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!vacationRequest) {
      reply.status(404).send({ error: 'Vacation request not found' });
      return;
    }

    if (vacationRequest.status !== 'PENDING') {
      reply.status(400).send({ error: 'Vacation request already processed' });
      return;
    }

    // Update status
    const updated = await prisma.vacationRequest.update({
      where: { id },
      data: {
        status: body.status,
        rejectionNote: body.rejectionNote,
        approvedBy: request.user.userId,
        approvedAt: new Date(),
      },
    });

    // Audit log
    await createAuditLog({
      userId: request.user.userId,
      companyId,
      action: 'UPDATE',
      entity: 'VacationRequest',
      entityId: updated.id,
      metadata: {
        status: body.status,
        rejectionNote: body.rejectionNote,
      },
    });

    reply.send({
      success: true,
      vacationRequest: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Approve/reject vacation error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getPendingVacationRequests = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only COMPANY_ADMIN can view pending requests
    if (request.user.role !== 'COMPANY_ADMIN' && request.user.role !== 'SUPER_ADMIN') {
      reply.status(403).send({ error: 'Forbidden' });
      return;
    }

    const companyId = getCompanyId(request);

    const requests = await prisma.vacationRequest.findMany({
      where: {
        companyId,
        status: 'PENDING',
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    reply.send({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('Get pending vacation requests error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
