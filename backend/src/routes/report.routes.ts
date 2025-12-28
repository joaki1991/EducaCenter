import { FastifyInstance } from 'fastify';
import * as reportController from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';

export default async function reportRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.get('/employee/:employeeId', reportController.getEmployeeReport);
  fastify.get('/company', reportController.getCompanyReport);
  fastify.get('/monthly', reportController.getMonthlyReport);
  fastify.get('/vacation', reportController.getVacationReport);
}
