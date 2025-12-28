import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { comparePassword } from '../utils/password.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import config from '../config/index.js';
import { createAuditLog } from '../utils/audit.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const body = loginSchema.parse(request.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: {
        employee: {
          include: {
            company: true,
          },
        },
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user || !user.active) {
      reply.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValid = await comparePassword(body.password, user.passwordHash);
    if (!isValid) {
      reply.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    // Determine company context
    let companyId: string | undefined;
    let companyIds: string[] | undefined;

    if (user.employee) {
      // Single company employee
      companyId = user.employee.companyId;
    } else if (user.userCompanies.length > 0) {
      // Multi-company user (gestoría)
      companyIds = user.userCompanies.map((uc) => uc.companyId);
    }

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId,
      companyIds,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId,
      companyIds,
    });

    // Set HTTPOnly cookies
    reply
      .setCookie('authToken', token, {
        httpOnly: true,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
        path: '/',
        maxAge: 7200, // 2 hours
      })
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
        path: '/',
        maxAge: 604800, // 7 days
      });

    // Create audit log
    await createAuditLog({
      userId: user.id,
      companyId,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
    });

    reply.send({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId,
        companyIds,
        companies: user.userCompanies.map((uc) => ({
          id: uc.company.id,
          name: uc.company.name,
          role: uc.role,
        })),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const logout = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Clear cookies
    reply
      .clearCookie('authToken', { path: '/' })
      .clearCookie('refreshToken', { path: '/' });

    reply.send({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const me = async (
  request: FastifyRequest & { user?: any },
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.userId },
      include: {
        employee: {
          include: {
            company: true,
          },
        },
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }

    reply.send({
      id: user.id,
      email: user.email,
      role: user.role,
      employee: user.employee
        ? {
            id: user.employee.id,
            companyId: user.employee.companyId,
            companyName: user.employee.company.name,
            startDate: user.employee.startDate,
            workCenter: user.employee.workCenter,
          }
        : null,
      companies: user.userCompanies.map((uc) => ({
        id: uc.company.id,
        name: uc.company.name,
        role: uc.role,
      })),
    });
  } catch (error) {
    console.error('Me error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
