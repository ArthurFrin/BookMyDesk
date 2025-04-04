import { FastifyInstance } from 'fastify'
import { register, login, getProfile, verifyToken } from '../controllers/auth.controller'

export default async function authRoutes(fastify: FastifyInstance) {
  // Route d'inscription
  fastify.post('/auth/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          photoUrl: { type: 'string' }
        }
      }
    }
  }, register)

  // Route de connexion
  fastify.post('/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, login)

  // Route pour obtenir le profil de l'utilisateur connecté
  fastify.get('/auth/profile', {
    onRequest: [fastify.authenticate]
  }, getProfile)

  // Route pour vérifier si le token est valide
  fastify.get('/auth/verify', {
    onRequest: [fastify.authenticate]
  }, verifyToken)
}