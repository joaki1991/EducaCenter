import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt.js';

export interface AuthRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    companyId?: string;
    companyIds?: string[];
  };
}

export const authenticate = async (
  request: AuthRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const token = request.cookies.authToken;

    if (!token) {
      reply.status(401).send({ error: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    request.user = decoded;
  } catch (error) {
    reply.status(401).send({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (request: AuthRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
  };
};

// Extract company ID from user session - CRITICAL for multi-tenant isolation
export const getCompanyId = (request: AuthRequest): string => {
  if (!request.user) {
    throw new Error('User not authenticated');
  }

  // For single-company users
  if (request.user.companyId) {
    return request.user.companyId;
  }

  // For multi-company users (gestorías), require explicit company selection
  // This should be handled by frontend sending company context
  const selectedCompanyId = request.headers['x-company-id'] as string;
  
  if (!selectedCompanyId) {
    throw new Error('Company context required');
  }

  // Verify user has access to this company
  if (request.user.companyIds && !request.user.companyIds.includes(selectedCompanyId)) {
    throw new Error('Access denied to this company');
  }

  return selectedCompanyId;
};
