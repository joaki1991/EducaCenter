import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthRequest, getCompanyId } from '../middleware/auth.js';
import { createAuditLog } from '../utils/audit.js';

const createCompanySchema = z.object({
  name: z.string().min(1),
  cif: z.string().min(9).max(9),
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
});

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
  active: z.boolean().optional(),
});

export const createCompany = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only SUPER_ADMIN can create companies
    if (request.user.role !== 'SUPER_ADMIN') {
      reply.status(403).send({ error: 'Forbidden: Only super admin can create companies' });
      return;
    }

    const body = createCompanySchema.parse(request.body);

    // Check if CIF already exists
    const existing = await prisma.company.findUnique({
      where: { cif: body.cif },
    });

    if (existing) {
      reply.status(400).send({ error: 'Company with this CIF already exists' });
      return;
    }

    const company = await prisma.company.create({
      data: {
        name: body.name,
        cif: body.cif,
        plan: body.plan || 'BASIC',
      },
    });

    await createAuditLog({
      userId: request.user.userId,
      companyId: company.id,
      action: 'CREATE',
      entity: 'Company',
      entityId: company.id,
      metadata: { name: body.name, cif: body.cif },
    });

    reply.status(201).send({
      success: true,
      company,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create company error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getCompanies = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    let companies;

    if (request.user.role === 'SUPER_ADMIN') {
      // Super admin can see all companies
      companies = await prisma.company.findMany({
        orderBy: { name: 'asc' },
      });
    } else if (request.user.companyIds && request.user.companyIds.length > 0) {
      // Multi-company user (gestoría)
      companies = await prisma.company.findMany({
        where: {
          id: { in: request.user.companyIds },
        },
        orderBy: { name: 'asc' },
      });
    } else if (request.user.companyId) {
      // Single company user
      companies = await prisma.company.findMany({
        where: {
          id: request.user.companyId,
        },
      });
    } else {
      companies = [];
    }

    reply.send({
      success: true,
      companies,
    });
  } catch (error) {
    console.error('Get companies error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const getCompany = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { id } = request.params as { id: string };

    // Verify user has access to this company
    if (
      request.user.role !== 'SUPER_ADMIN' &&
      request.user.companyId !== id &&
      (!request.user.companyIds || !request.user.companyIds.includes(id))
    ) {
      reply.status(403).send({ error: 'Forbidden: Access denied to this company' });
      return;
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            employees: true,
            timeEntries: true,
            vacationRequests: true,
          },
        },
      },
    });

    if (!company) {
      reply.status(404).send({ error: 'Company not found' });
      return;
    }

    reply.send({
      success: true,
      company,
    });
  } catch (error) {
    console.error('Get company error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const updateCompany = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Only SUPER_ADMIN or COMPANY_ADMIN can update
    if (
      request.user.role !== 'SUPER_ADMIN' &&
      request.user.role !== 'COMPANY_ADMIN'
    ) {
      reply.status(403).send({ error: 'Forbidden' });
      return;
    }

    const { id } = request.params as { id: string };
    const body = updateCompanySchema.parse(request.body);

    // Verify access
    if (
      request.user.role !== 'SUPER_ADMIN' &&
      request.user.companyId !== id &&
      (!request.user.companyIds || !request.user.companyIds.includes(id))
    ) {
      reply.status(403).send({ error: 'Forbidden: Access denied to this company' });
      return;
    }

    const company = await prisma.company.update({
      where: { id },
      data: body,
    });

    await createAuditLog({
      userId: request.user.userId,
      companyId: id,
      action: 'UPDATE',
      entity: 'Company',
      entityId: id,
      metadata: body,
    });

    reply.send({
      success: true,
      company,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Update company error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
