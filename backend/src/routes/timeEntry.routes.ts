import { FastifyInstance } from 'fastify';
import * as timeEntryController from '../controllers/timeEntry.controller.js';
import { authenticate } from '../middleware/auth.js';

export default async function timeEntryRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.post('/check-in', timeEntryController.checkIn);
  fastify.post('/check-out', timeEntryController.checkOut);
  fastify.get('/my-entries', timeEntryController.getMyTimeEntries);
  fastify.get('/status', timeEntryController.getCurrentStatus);
}
