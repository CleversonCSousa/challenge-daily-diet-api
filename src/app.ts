import fastify from 'fastify';
import { usersRoutes } from './http/usersRoutes';
export const app = fastify();

app.register(usersRoutes, {
  prefix: '/users',
});
