import { FastifyInstance } from 'fastify';
import { userRoutes } from './userRoutes';

export async function appRoutes(app: FastifyInstance) {
    app.register(userRoutes, {
        prefix: 'users'
    });
}

