import { FastifyInstance } from 'fastify'
import { getAvailability } from '../controllers/availability.controller'

export default async function availabilityRoutes(app: FastifyInstance) {
  app.get('/availability', getAvailability)
}