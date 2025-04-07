import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import prismaPlugin from '../plugins/prismaPlugin';
import jwtPlugin from '../plugins/jwtPlugin';
import mailerPlugin from '../plugins/mailerPlugin';
import availabilityRoutes from '../routes/availability.route';
import deskRoutes from '../routes/desk.route';
import authRoutes from '../routes/auth.route';
import adminRoutes from '../routes/admin.route';

// Cette fonction construit une instance de l'application Fastify
// sans démarrer le serveur, ce qui est parfait pour les tests
export async function build(): Promise<FastifyInstance> {
  const app = fastify({ logger: false });
  
  // Enregistrer le plugin CORS
  await app.register(cors, {
    origin: true
  });

  // Enregistrer les plugins
  await app.register(prismaPlugin);
  await app.register(jwtPlugin);
  await app.register(mailerPlugin);
  
  // Enregistrer les routes
  await app.register(availabilityRoutes, { prefix: '/api' });
  await app.register(deskRoutes, { prefix: '/api' });
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(adminRoutes, { prefix: '/api' });
  
  // Enregistrer la route ping pour les tests de health check
  app.get('/ping', async () => {
    return 'pong\n';
  });

  return app;
}