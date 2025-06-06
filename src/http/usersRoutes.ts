import { prismaClient } from '@/lib/prisma/prismaClient';
import { hash, compare } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { env } from '@/env';

export async function usersRoutes(app: FastifyInstance) {
  
  app.post('/', async (request, reply) => {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email({
        message: 'Email is invalid'
      }),
      password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
      }),
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

  app.post('/auth', async (request, reply) => {
    const signInBodySchema = z.object({
      email: z.string().email({
        message: 'Invalid email'
      }),
      password: z.string()
    });

    const { email, password } = signInBodySchema.parse(request.body);


    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!user) {
      return reply.status(401).send({
        message: 'Incorrect credentials'
      });
    }

    const passwordsMatch = await compare(password, user.password);

    if (!passwordsMatch) {
      return reply.status(401).send({
        message: 'Incorrect credentials'
      });
    }

    const token = sign({
      name: user.name,
      email: user.email,
      id: user.id
    }, env.JWT_SECRET);

    return reply.cookie('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }).status(200).send({
      message: 'Authentication successful'
    });

  });
}
