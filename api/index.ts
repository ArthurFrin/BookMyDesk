import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import prismaPlugin from './src/plugins/prismaPlugin';
import availabilityRoutes from './src/routes/availability.route';
import deskRoutes from './src/routes/desk.route';
import authRoutes from './src/routes/auth.route';
import adminRoutes from './src/routes/admin.route';
import jwtPlugin from './src/plugins/jwtPlugin';
import mailerPlugin from './src/plugins/mailerPlugin';

const app = fastify();
// Enregistrer le plugin CORS
app.register(cors, {
  origin: true
});

app.register(prismaPlugin);
app.register(jwtPlugin);
app.register(mailerPlugin);

// Register routes
app.register(availabilityRoutes, { prefix: '/api' })
app.register(deskRoutes, { prefix: '/api' })
app.register(authRoutes, { prefix: '/api' })
app.register(adminRoutes, { prefix: '/api' })

// Health check endpoint
app.get('/ping', async (request, reply) => {
  return 'pong\n';
});

// Start server
app.listen({ 
  port: 3000, 
  host: '0.0.0.0'
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});