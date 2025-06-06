import { EditMealUseCase } from '@/use-cases/meals/edit-meal-use-case';
import { regexTimeMeal } from '@/utils/time-meal-regex';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function editMealController(request: FastifyRequest, reply: FastifyReply) {
    const mealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        is_within_diet: z.boolean(),
        date: z.coerce.date(),
        time: z.string().regex(regexTimeMeal, {
            message: 'Time invalid format'
        }),
        meal_id: z.string().uuid()
      });
  
      const { name, description, is_within_diet, date, time, meal_id } = mealBodySchema.parse(request.body);
      
      try {
        const editMealUseCase = new EditMealUseCase();
        await editMealUseCase.execute({ name, description, is_within_diet, date, time, meal_id, user_id: request.user.id });
      } catch (error) {
        return reply.status(500).send();
      }
  
      return reply.status(201).send();
  
}
