import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthRequest, getCompanyId } from '../middleware/auth.js';
import { createAuditLog } from '../utils/audit.js';

const checkInSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  comment: z.string().optional(),
});

const checkOutSchema = z.object({
  comment: z.string().optional(),
});

export const checkIn = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const body = checkInSchema.parse(request.body);
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

    // Check if there's an active entry (last entry is IN without OUT)
    const lastEntry = await prisma.timeEntry.findFirst({
      where: {
        employeeId: employee.id,
        companyId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (lastEntry && lastEntry.type === 'IN') {
      reply.status(400).send({ 
        error: 'Already checked in',
        message: 'You must check out before checking in again',
      });
      return;
    }

    // Create check-in entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        employeeId: employee.id,
        companyId,
        type: 'IN',
        latitude: body.latitude,
        longitude: body.longitude,
        comment: body.comment,
      },
    });

    // Audit log
    await createAuditLog({
      userId: request.user.userId,
      companyId,
      action: 'CREATE',
      entity: 'TimeEntry',
      entityId: timeEntry.id,
      metadata: { type: 'IN', timestamp: timeEntry.timestamp },
    });

    reply.status(201).send({
      success: true,
      timeEntry: {
        id: timeEntry.id,
        type: timeEntry.type,
        timestamp: timeEntry.timestamp,
        latitude: timeEntry.latitude,
        longitude: timeEntry.longitude,
        comment: timeEntry.comment,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Check-in error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const checkOut = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const body = checkOutSchema.parse(request.body);
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

    // Check if there's an active entry (last entry must be IN)
    const lastEntry = await prisma.timeEntry.findFirst({
      where: {
        employeeId: employee.id,
        companyId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!lastEntry || lastEntry.type === 'OUT') {
      reply.status(400).send({ 
        error: 'Not checked in',
        message: 'You must check in before checking out',
      });
      return;
    }

    // Create check-out entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        employeeId: employee.id,
        companyId,
        type: 'OUT',
        comment: body.comment,
      },
    });

    // Audit log
    await createAuditLog({
      userId: request.user.userId,
      companyId,
      action: 'CREATE',
      entity: 'TimeEntry',
      entityId: timeEntry.id,
      metadata: { type: 'OUT', timestamp: timeEntry.timestamp },
    });

    reply.status(201).send({
      success: true,
      timeEntry: {
        id: timeEntry.id,
        type: timeEntry.type,
        timestamp: timeEntry.timestamp,
        comment: timeEntry.comment,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Check-out error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getMyTimeEntries = async (
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

    // Get query parameters for filtering
    const { startDate, endDate } = request.query as {
      startDate?: string;
      endDate?: string;
    };

    const whereClause: any = {
      employeeId: employee.id,
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
    console.error('Get time entries error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getCurrentStatus = async (
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

    // Get last entry
    const lastEntry = await prisma.timeEntry.findFirst({
      where: {
        employeeId: employee.id,
        companyId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    reply.send({
      success: true,
      status: lastEntry?.type === 'IN' ? 'CHECKED_IN' : 'CHECKED_OUT',
      lastEntry: lastEntry || null,
    });
  } catch (error) {
    console.error('Get current status error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
