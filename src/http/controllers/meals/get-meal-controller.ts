import { GetMealUseCase } from '@/use-cases/meals/get-meal-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getMealController(request: FastifyRequest, reply: FastifyReply) {
    const getMealParamsSchema = z.object({
          meal_id: z.string().uuid()
        });
    
    const { meal_id } = getMealParamsSchema.parse(request.params);
    
    try {
        const getMealUseCase = new GetMealUseCase();
        const { meal } = await getMealUseCase.execute({ user_id: request.user.id, meal_id });
        if (!meal) {
        return reply.status(404).send();
        }
    
        return reply.status(200).send({
        meal
        });
    
    } catch (err) {
        return reply.status(500).send();
    }
}