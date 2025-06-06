import { prismaClient } from '@/lib/prisma/prismaClient';

interface DeleteMealCaseRequest {
    user_id: string;
    meal_id: string;
}

export class DeleteMealUseCase {
    async execute({ user_id, meal_id } : DeleteMealCaseRequest) {
        await prismaClient.meal.delete({
              where: {
                id: meal_id,
                user_id: user_id
              }
        });
    }
}