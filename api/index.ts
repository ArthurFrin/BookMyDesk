import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import userRoutes from './src/routes/articleRoutes';
import prismaPlugin from './src/plugins/prismaPlugin';
import availabilityRoutes from './src/routes/availability.route'

const app = fastify();
// Enregistrer le plugin CORS
app.register(cors, {
  origin: true
});

app.register(prismaPlugin);

// Register routes
app.register(availabilityRoutes, { prefix: '/api' })

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