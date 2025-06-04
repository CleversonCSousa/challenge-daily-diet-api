
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { checkIsAuthenticated } from './middlewares/check-is-authenticated';
import { prismaClient } from '@/lib/prisma/prismaClient';

export async function mealsRoutes(app: FastifyInstance) {
  
  app.post('/', {
    preHandler: [checkIsAuthenticated]
  }, async (request, reply) => {
    
    const { id } = request.user;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    const registerBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        is_within_diet: z.boolean(),
        date: z.coerce.date(),
        time: z.string().regex(timeRegex, {
            message: 'Time must be in HH:mm format'
        })
    });

    const { name, description, is_within_diet, date, time } = registerBodySchema.parse(request.body);

    await prismaClient.meal.create({
        data: {
            name,
            description,
            is_within_diet,
            date,
            time,
            user_id: id
        }
    });

    return reply.status(201).send();

  });
}
