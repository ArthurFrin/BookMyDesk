import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { FastifyRequest, FastifyReply } from 'fastify'

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-key'
  })

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.status(401).send({ error: 'Non autorisé' })
      }
    }
  )

  fastify.decorate(
    'authenticateAdmin',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        
        // Vérifier si l'utilisateur est un administrateur
        const user = request.user as { id: number; isAdmin?: boolean }
        
        if (!user.isAdmin) {
          return reply.status(403).send({ error: 'Accès refusé. Droits d\'administrateur requis.' })
        }
      } catch (err) {
        reply.status(401).send({ error: 'Non autorisé' })
      }
    }
  )
})
