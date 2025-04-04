import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcrypt'

// --- REGISTER ---
export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password, firstName, lastName, photoUrl } = request.body as {
      email: string
      password: string
      firstName: string
      lastName: string
      photoUrl?: string
    }

    const prisma = request.server.prisma

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return reply.status(400).send({ error: 'Cet email est déjà utilisé' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        photoUrl: photoUrl ?? ''
      }
    })

    const token = await reply.jwtSign({ id: newUser.id, email: newUser.email })

    return reply.status(201).send({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        photoUrl: newUser.photoUrl
      },
      token
    })
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: "Erreur lors de l'inscription" })
  }
}

// --- LOGIN ---
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as { email: string; password: string }
    const prisma = request.server.prisma

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
    }

    const token = await reply.jwtSign({ id: user.id, email: user.email })

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl
      },
      token
    })
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Erreur lors de la connexion' })
  }
}

// --- GET PROFILE ---
export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.user
    const prisma = request.server.prisma

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true
      }
    })

    if (!user) {
      return reply.status(404).send({ error: 'Utilisateur non trouvé' })
    }

    return reply.send(user)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Erreur lors de la récupération du profil' })
  }
}

// --- VERIFY TOKEN ---
export const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.send({ valid: true, user: request.user })
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Erreur lors de la vérification du token' })
  }
}
