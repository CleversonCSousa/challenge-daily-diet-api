import { prismaClient } from '@/lib/prisma/prismaClient';

interface GetMealCaseRequest {
    user_id: string;
    meal_id: string;
}



export class GetMealUseCase {
    async execute({ user_id, meal_id } : GetMealCaseRequest ) {

        const meal = await prismaClient.meal.findUnique({
            where: {
              user_id: user_id,
              id: meal_id
            },
            select: {
              id: true,
              name: true,
              description: true,
              date: true,
              time: true,
              is_within_diet: true
            }
        });

        return {
            meal
        };
    }
}