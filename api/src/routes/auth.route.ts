import { FastifyInstance } from 'fastify'
import { register, login, getProfile, verifyToken, createPassword, updateProfile } from '../controllers/auth.controller'


export default async function authRoutes(fastify: FastifyInstance) {
  // Route d'inscription
  fastify.post('/auth/register', {
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

  // route de creation du password
  fastify.post('/auth/create-password', {
    schema: {
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, createPassword);
  

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

  fastify.put('/auth/profile', {
    onRequest: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: [],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          photoUrl: { type: 'string' }
        }
      }
    }
  }, updateProfile);
  
}