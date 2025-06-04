import fastify from 'fastify';
import { userRoutes } from './http/userRoutes';
export const app = fastify();

app.register(userRoutes, {
  prefix: 'users',
});
