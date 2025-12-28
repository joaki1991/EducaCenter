import { FastifyInstance } from 'fastify';
import * as employeeController from '../controllers/employee.controller.js';
import { authenticate } from '../middleware/auth.js';

export default async function employeeRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', employeeController.createEmployee);
  fastify.get('/', employeeController.getEmployees);
  fastify.get('/:id', employeeController.getEmployee);
  fastify.put('/:id', employeeController.updateEmployee);
  fastify.get('/:id/time-entries', employeeController.getEmployeeTimeEntries);
}
