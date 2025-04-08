import { FastifyInstance } from 'fastify'
import { register, getAllUsers, promoteUser } from '../controllers/admin.controller'

export default async function adminRoutes(fastify: FastifyInstance) {
  // Toutes les routes admin sont protégées par le middleware authenticateAdmin
  
  // Route pour créer un nouvel utilisateur par l'admin
  fastify.post('/admin/users', {
    onRequest: [fastify.authenticateAdmin],
    schema: {
      body: {
        type: 'object',
        required: ['email', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          photoUrl: { type: 'string' }
        }
      }
    }
  }, register)
  
  // Liste des utilisateurs (réservée à l'admin)
  fastify.get('/admin/users', {
    onRequest: [fastify.authenticateAdmin]
  }, getAllUsers)
  
  // Route pour promouvoir un utilisateur au rang d'admin
  fastify.put('/admin/users/:id/promote', {
    onRequest: [fastify.authenticateAdmin],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, promoteUser)
}