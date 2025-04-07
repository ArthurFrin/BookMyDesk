import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const createPassword = async (request: FastifyRequest , reply: FastifyReply) => {
  const { token } = request.body as { token: string };
  const { password } = request.body as { password: string };

  if (!password) {
    return reply.status(400).send({ error: 'Mot de passe requis' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET!) as { userId: string };
  } catch (err: any) {
    return reply.status(400).send({ error: 'Lien invalide ou expiré' });
  }

  const prisma = request.server.prisma;
  const user = await prisma.user.findUnique({ where: { id: Number(payload.userId) } });

  if (!user) return reply.status(404).send({ error: 'Utilisateur introuvable' });
  if (user.password) return reply.status(400).send({ error: 'Mot de passe déjà défini' });

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hash }
  });

  return reply.send({ message: 'Mot de passe défini. Vous pouvez maintenant vous connecter.' });
};

// --- LOGIN ---
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as { email: string; password: string }
    const prisma = request.server.prisma

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
    }

    if (!user.password) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' });
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
    }

    const token = await reply.jwtSign({ 
      id: user.id, 
      email: user.email,
      isAdmin: user.isAdmin
    })

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        isAdmin: user.isAdmin
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
        photoUrl: true,
        isAdmin: true
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
    const { id } = request.user;
    const prisma = request.server.prisma;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        isAdmin: true
      }
    });

    if (!user) {
      return reply.status(404).send({ error: 'Utilisateur non trouvé' });
    }

    return reply.send({ valid: true, user });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Erreur lors de la vérification du token' });
  }
};

export const updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.user;
    const { firstName, lastName, photoUrl } = request.body as {
      firstName?: string;
      lastName?: string;
      photoUrl?: string;
    };

    const prisma = request.server.prisma;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        photoUrl
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        isAdmin: true
      }
    });

    return reply.send(updatedUser);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Erreur lors de la mise à jour du profil' });
  }
};


