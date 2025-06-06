import { FastifyInstance } from 'fastify';
import { registerUserController } from '../controllers/user/register-user-controller';
import { signInController } from '../controllers/user/sign-in-user-controller';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', registerUserController);
  app.post('/auth', signInController);
}
