import fastify from 'fastify';
import { usersRoutes } from './http/usersRoutes';
import fastifyCookie from '@fastify/cookie';
import { mealsRoutes } from './http/mealsRoutes';
export const app = fastify();
app.register(fastifyCookie);
app.register(usersRoutes, {
  prefix: '/users',
});

app.register(mealsRoutes, {
    prefix: '/meals'
});