import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import config from './config/index.js';
import prisma from './config/prisma.js';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import timeEntryRoutes from './routes/timeEntry.routes.js';
import vacationRoutes from './routes/vacation.routes.js';
import reportRoutes from './routes/report.routes.js';

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
await fastify.register(helmet, {
  contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false,
});

await fastify.register(cors, {
  origin: config.cors.origin,
  credentials: true,
});

await fastify.register(cookie, {
  secret: config.jwt.secret,
});

// Health check
fastify.get('/health', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'error', error: 'Database connection failed' };
  }
});

// API routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(companyRoutes, { prefix: '/api/companies' });
fastify.register(employeeRoutes, { prefix: '/api/employees' });
fastify.register(timeEntryRoutes, { prefix: '/api/time-entries' });
fastify.register(vacationRoutes, { prefix: '/api/vacations' });
fastify.register(reportRoutes, { prefix: '/api/reports' });

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({ error: 'Internal server error' });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`🚀 Server listening on http://localhost:${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

start();
