import { prismaClient } from '@/lib/prisma/prismaClient';

interface RegisterUseCaseRequest {
    name: string;
    description?: string;
    is_within_diet: boolean;
    date: Date;
    time: string;
    user_id: string;
}

export class RegisterMealUseCase {
    async execute({ name, description, is_within_diet, date, time, user_id }: RegisterUseCaseRequest) {
        await prismaClient.meal.create({
            data: {
                name,
                description,
                is_within_diet,
                date,
                time,
                user_id
                
            }
        });
    }
}
