import { FastifyRequest, FastifyReply } from "fastify";
import jwt from 'jsonwebtoken';

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, lastName, photoUrl } = request.body as {
    email: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
  };

  const prisma = request.server.prisma;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return reply.status(400).send({ error: 'Cet email est déjà utilisé' });
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      photoUrl: photoUrl ?? '',
      isAdmin: false,
      password: null
    }
  });

  const token = jwt.sign(
    { userId: newUser.id },
    process.env.ACTIVATION_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  const link = `${frontendUrl}/create-password/${token}`;
  
  await request.server.mailer.sendMail({
    from: '"Support" <no-reply@tonapp.com>',
    to: email,
    subject: 'Créez votre mot de passe',
    html: `
      <p>Bonjour ${firstName},</p>
      <p>Cliquez sur le lien ci-dessous pour créer votre mot de passe :</p>
      <p><a href="${link}">${link}</a></p>
      <p>Ce lien est valable 24h.</p>
    `
  });

  return reply.code(201).send({ message: 'Lien de création de mot de passe envoyé.' });
};

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const prisma = request.server.prisma;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        isAdmin: true
      }
    });
    return reply.send(users);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

export const promoteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const prisma = request.server.prisma;
    
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        isAdmin: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true
      }
    });
    
    return reply.send(updatedUser);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Erreur lors de la promotion de l\'utilisateur' });
  }
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const { firstName, lastName, email, photoUrl, isAdmin } = request.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      photoUrl?: string;
      isAdmin?: boolean;
    };

    const prisma = request.server.prisma;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: parseInt(id) }
        }
      });

      if (existingUser) {
        return reply.status(400).send({ error: 'Cet email est déjà utilisé par un autre utilisateur' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(isAdmin !== undefined && { isAdmin })
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
    return reply.status(500).send({ error: 'Erreur lors de la mise à jour de l\'utilisateur·ice' });
  }
};

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const prisma = request.server.prisma;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return reply.status(404).send({ error: 'Utilisateur·ice non trouvé·e' });
    }

    // Supprimer d'abord les réservations liées à cet utilisateur
    await prisma.reservation.deleteMany({
      where: { userId: parseInt(id) }
    });

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return reply.send({ message: 'Utilisateur·ice supprimé·e avec succès' });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Erreur lors de la suppression de l\'utilisateur·ice' });
  }
};