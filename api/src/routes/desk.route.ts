import { FastifyInstance } from 'fastify'
import { reserveDesk, unfollowDesk } from '../controllers/desk.controller'

export default async function deskRoutes(app: FastifyInstance) {
  app.post('/desks/:deskId/reserve', reserveDesk)
  app.post('/desks/:deskId/unfollow', unfollowDesk)
}