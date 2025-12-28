import { FastifyInstance } from 'fastify';
import * as vacationController from '../controllers/vacation.controller.js';
import { authenticate } from '../middleware/auth.js';

export default async function vacationRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', vacationController.createVacationRequest);
  fastify.get('/my-requests', vacationController.getMyVacationRequests);
  fastify.get('/balance', vacationController.getVacationBalance);
  fastify.get('/pending', vacationController.getPendingVacationRequests);
  fastify.put('/:id/approve-reject', vacationController.approveRejectVacation);
}
