import { FastifyInstance } from 'fastify'
import { getAvailability, getAvailableDesksForDay } from '../controllers/availability.controller'

export default async function availabilityRoutes(app: FastifyInstance) {
  app.get('/availability', getAvailability)
  app.get('/availability/day/:date', getAvailableDesksForDay)
}