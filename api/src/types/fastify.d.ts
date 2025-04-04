import { PrismaClient } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import '@fastify/jwt'

// Étendre FastifyInstance pour inclure `prisma` et `authenticate`
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

// Étendre FastifyJWT pour typer le contenu du token
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; email: string }
    user: { id: number; email: string }
  }
}
