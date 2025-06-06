import { DeleteMealUseCase } from '@/use-cases/meals/delete-meal-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function deleteMealController(request: FastifyRequest, reply: FastifyReply) {
    const mealBodySchema = z.object({
        meal_id: z.string().uuid()
      });
  
      const { meal_id } = mealBodySchema.parse(request.body);
  
      try {
        const deleteMealUseCase = new DeleteMealUseCase();
  
        await deleteMealUseCase.execute({ meal_id, user_id: request.user.id });
      } catch (error) {
        return reply.status(400).send();
      }
  
      return reply.status(200).send();
  
}
