import { prismaClient } from '@/lib/prisma/prismaClient';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { env } from '@/env';

export async function usersRoutes(app: FastifyInstance) {
  
  app.post('/', async (request, reply) => {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);
    const password_hash = await hash(password, 6);
    
    const userWithSameEmail = await prismaClient.user.findUnique({
        where: {
            email
        }
    });

    if (userWithSameEmail) {
        return reply.status(409).send();
    }


    const { id } = await prismaClient.user.create({
        data: {
            name,
            email,
            password: password_hash
        }
    });

    const token = sign({
      name,
      email,
      id
    }, env.JWT_SECRET);

    return reply.cookie('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }).status(201).send();
  });
}
