import { FastifyInstance } from 'fastify';
import * as companyController from '../controllers/company.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function companyRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', companyController.createCompany);
  fastify.get('/', companyController.getCompanies);
  fastify.get('/:id', companyController.getCompany);
  fastify.put('/:id', companyController.updateCompany);
}
