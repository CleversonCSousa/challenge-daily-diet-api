import { prismaClient } from '@/lib/prisma/prismaClient';

interface EditMealCaseRequest {
    name: string;
    description?: string;
    is_within_diet: boolean;
    date: Date;
    time: string;
    user_id: string;
    meal_id: string;
}

export class EditMealUseCase {
    async execute({ name, description, is_within_diet, date, time, user_id, meal_id }: EditMealCaseRequest) {
        await prismaClient.meal.update({
            where: {
              user_id: user_id,
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
    }
}
