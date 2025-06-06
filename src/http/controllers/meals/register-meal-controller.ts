import { RegisterMealUseCase } from '@/use-cases/meals/register-meal-use-case';
import { regexTimeMeal } from '@/utils/time-meal-regex';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function registerMealController(request: FastifyRequest, reply: FastifyReply) {
    const mealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        is_within_diet: z.boolean(),
        date: z.coerce.date(),
        time: z.string().regex(regexTimeMeal, {
            message: 'Time invalid format',
        })
      });
  
      const { name, description, is_within_diet, date, time } = mealBodySchema.parse(request.body);
  
      try {
        const registerMealUseCase = new RegisterMealUseCase();
        await registerMealUseCase.execute({ name, description, is_within_diet, date, time, user_id: request.user.id });
      } catch (error) {
        return reply.status(500).send();
      }
}