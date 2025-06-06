import { prismaClient } from '@/lib/prisma/prismaClient';

interface GetMealsCaseRequest {
    user_id: string;
}


export class GetMealsUseCase {
    async execute({ user_id } : GetMealsCaseRequest ) {
        
        const meals = await prismaClient.meal.findMany({
              where: {
                user_id: user_id
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
            meals
        };
    }
}