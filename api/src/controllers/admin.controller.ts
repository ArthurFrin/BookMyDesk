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