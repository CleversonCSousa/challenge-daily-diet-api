import { IncorretUserCredentials } from '@/use-cases/errors/incorrect-credentials';
import { SignInUserUseCase } from '@/use-cases/users/sign-in-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function signInController(request: FastifyRequest, reply: FastifyReply) {
    const signInBodySchema = z.object({
        email: z.string().email({
          message: 'Invalid email'
        }),
        password: z.string()
      });
  
    const { email, password } = signInBodySchema.parse(request.body);
  
  
    try {
        const signInUserUseCase = new SignInUserUseCase();
        const { token } = await signInUserUseCase.execute({ email, password });

        return reply.cookie('token', token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        }).status(200).send({
            message: 'Authentication successful'
        });

    } catch (error) {
        if (error instanceof IncorretUserCredentials) {
            return reply.status(409).send({
                message: error.message
            });
        }
        
        return reply.status(500).send();
    }
}
