import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';
export default fp(async (fastify, opts) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true → SSL (port 465), false → TLS (port 587 ou 1025 MailHog)
    auth: process.env.SMTP_AUTH === 'true' ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
  });

  fastify.decorate('mailer', transporter);
});

declare module 'fastify' {
  interface FastifyInstance {
    mailer: nodemailer.Transporter;
  }
}
