import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

export default async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/login', authController.login);
  fastify.post('/logout', authController.logout);

  // Protected routes
  fastify.get('/me', { preHandler: authenticate }, authController.me);
}
