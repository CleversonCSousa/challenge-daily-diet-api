import { prismaClient } from '@/lib/prisma/prismaClient';

interface GetMealsMetricsCaseRequest {
    user_id: string;
}


export class GetMealsMetricsUseCase {
    async execute({ user_id } : GetMealsMetricsCaseRequest) {
        const [meals, totalMeals, mealsWithinDiet, mealsOutsideDiet] = await Promise.all([
              prismaClient.meal.findMany({
                where: { user_id },
                orderBy: [{ date: 'asc' }, { time: 'asc' }],
              }),
              prismaClient.meal.count({ where: { user_id } }),
              prismaClient.meal.count({ where: { user_id, is_within_diet: true } }),
              prismaClient.meal.count({ where: { user_id, is_within_diet: false } }),
            ]);
        
            /**
             * Calcula a melhor sequência (streak) de refeições dentro da dieta.
             * 
             * ATENÇÃO: Esta função não é performática para grandes volumes de dados,
             * pois carrega todos os registros na memória e itera sobre eles.
             * Para grandes volumes de dados, recomenda-se implementar a lógica no banco de dados.
             * 
             * @author cleversonsousa
            */
            
            const { bestStreak } = meals.reduce(
              (acc: { currentStreak: number, bestStreak: number }, meal) => {
                if (meal.is_within_diet) {
                  acc.currentStreak += 1;
                  acc.bestStreak = Math.max(acc.bestStreak, acc.currentStreak);
                } else {
                  acc.currentStreak = 0;
                }
                return acc;
              },
              { currentStreak: 0, bestStreak: 0 }
            );
        return {
            totalMeals,
            mealsWithinDiet,
            mealsOutsideDiet,
            bestStreak
        };
    }
}