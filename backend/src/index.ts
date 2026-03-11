import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { pool } from './config/database';
import type { HealthResponse } from './types/api';
import { createEntryHandler } from './routes/entries';
import { createCharacterHandler, getCharactersHandler } from './routes/characters';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT || '8001');
const HOST = '0.0.0.0';

// Create Fastify instance
const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development' ? true : false,
});

// Register CORS
fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register multipart (for audio file uploads)
fastify.register(multipart, {
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Health check endpoint
fastify.get('/api/health', async (request, reply) => {
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';
  
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    fastify.log.error(`Database health check failed: ${(error as Error).message}`);
  }

  const response: HealthResponse = {
    status: dbStatus === 'connected' ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    ai_mode: (process.env.AI_MODE as 'stub' | 'live') || 'stub',
  };

  return reply.code(dbStatus === 'connected' ? 200 : 503).send(response);
});

// Root endpoint
fastify.get('/api/', async (request, reply) => {
  return {
    app: 'Riverb API',
    version: '1.0.0',
    status: 'running',
    ai_mode: process.env.AI_MODE || 'stub',
  };
});

// Temporary project download route
fastify.get('/api/download-project', async (request, reply) => {
  const fs = await import('fs');
  const zipPath = '/app/riverb-project.zip';
  if (!fs.existsSync(zipPath)) {
    return reply.code(404).send({ error: 'Zip not found' });
  }
  const stat = fs.statSync(zipPath);
  reply.header('Content-Type', 'application/zip');
  reply.header('Content-Disposition', 'attachment; filename="riverb-project.zip"');
  reply.header('Content-Length', stat.size);
  return reply.send(fs.createReadStream(zipPath));
});

// API Routes
fastify.post('/api/entries', createEntryHandler);
fastify.post('/api/characters', createCharacterHandler);
fastify.get('/api/characters/:userId', getCharactersHandler);

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  fastify.log.info(`Received ${signal}, closing server gracefully...`);
  await fastify.close();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`
╔═══════════════════════════════════════╗
║     🌊 Riverb API Server Running     ║
║                                       ║
║  Port: ${PORT}                          ║
║  Mode: ${process.env.NODE_ENV || 'development'}               ║
║  AI:   ${process.env.AI_MODE || 'stub'}                     ║
╚═══════════════════════════════════════╝
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
