
import { FastifyInstance } from 'fastify';
import { checkUserIsAuthenticated } from '../middlewares/check-is-authenticated';
import { registerMealController } from '../controllers/meals/register-meal-controller';
import { editMealController } from '../controllers/meals/edit-meal-controller';
import { deleteMealController } from '../controllers/meals/delete-meal-controller';
import { getMealsController } from '../controllers/meals/get-meals-controller';
import { getMealController } from '../controllers/meals/get-meal-controller';
import { getMealsMetricsController } from '../controllers/meals/get-meals-metrics-controller';

export async function mealsRoutes(app: FastifyInstance) {
  
  app.post('/', {
    preHandler: [checkUserIsAuthenticated]
  }, registerMealController);
  app.put('/', {
    preHandler: [checkUserIsAuthenticated]
  }, editMealController);

  app.delete('/', {
    preHandler: [checkUserIsAuthenticated]
  }, deleteMealController);

  app.get('/', {
    preHandler: [checkUserIsAuthenticated]
  }, getMealsController);

  app.get<{
    Params: {
      meal_id: string,
    }
  }>('/:meal_id', {
    preHandler: [checkUserIsAuthenticated]
  }, getMealController);

  app.get('/metrics', {
    preHandler: [checkUserIsAuthenticated]
  },  getMealsMetricsController);
}
