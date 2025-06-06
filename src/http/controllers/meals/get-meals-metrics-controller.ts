import { GetMealsMetricsUseCase } from '@/use-cases/meals/get-meals-metrics-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getMealsMetricsController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getMealsMetricsUseCase = new GetMealsMetricsUseCase();
        const { bestStreak, mealsOutsideDiet, mealsWithinDiet, totalMeals } = await getMealsMetricsUseCase.execute({ user_id: request.user.id });
    
        reply.status(200).send({
            totalMeals,
            mealsOutsideDiet,
            mealsWithinDiet,
            bestStreak
        });
    
    } catch (error) {
        return reply.status(500).send();
    }
}