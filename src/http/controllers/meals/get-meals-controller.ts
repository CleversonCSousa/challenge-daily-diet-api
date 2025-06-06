import { GetMealsUseCase } from '@/use-cases/meals/get-meals-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getMealsController(request: FastifyRequest, reply: FastifyReply) {
    try {
          const getMealsUseCase = new GetMealsUseCase();
          const { meals } = await getMealsUseCase.execute({ user_id: request.user.id });
          return reply.status(200).send({
            meals
          });
        } catch (error) {
          return reply.status(500).send();
        }
    
}