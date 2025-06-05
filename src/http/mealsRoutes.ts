
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { checkIsAuthenticated } from './middlewares/check-is-authenticated';
import { prismaClient } from '@/lib/prisma/prismaClient';

export async function mealsRoutes(app: FastifyInstance) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  
  
  app.post('/', {
    preHandler: [checkIsAuthenticated]
  }, async (request, reply) => {

    const mealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      is_within_diet: z.boolean(),
      date: z.coerce.date(),
      time: z.string().regex(timeRegex, {
          message: 'Time must be in HH:mm format'
      })
    });
    
    const { id } = request.user;


    const { name, description, is_within_diet, date, time } = mealBodySchema.parse(request.body);

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

  app.put('/', {
    preHandler: [checkIsAuthenticated]
  }, async (request, reply) => {
    const mealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      is_within_diet: z.boolean(),
      date: z.coerce.date(),
      time: z.string().regex(timeRegex, {
          message: 'Time must be in HH:mm format'
      }),
      meal_id: z.string().uuid()
    });

    const { id } = request.user;

    const { name, description, is_within_diet, date, time, meal_id } = mealBodySchema.parse(request.body);
    
    await prismaClient.meal.update({
      where: {
        user_id: id,
        id: meal_id
      },
      data: {
          name,
          description,
          is_within_diet,
          date,
          time,
      }
    });

    return reply.status(201).send();

  });
}
