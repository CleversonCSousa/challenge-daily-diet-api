import fastifyCookie from '@fastify/cookie';
import { FastifyInstance } from 'fastify';
import { usersRoutes } from './usersRoutes';
import { mealsRoutes } from './mealsRoutes';

export async function appRoutes(app: FastifyInstance) {
    app.register(fastifyCookie);

    app.register(usersRoutes, {
        prefix: '/users',
    });

    app.register(mealsRoutes, {
        prefix: '/meals'
    });
}