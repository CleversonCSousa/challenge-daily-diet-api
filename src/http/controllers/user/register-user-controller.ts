
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists';
import { RegisterUserUseCase } from '@/use-cases/users/register-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function registerUserController(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email({
          message: 'Email is invalid'
        }),
        password: z.string().min(6, {
          message: 'Password must be at least 6 characters long'
        }),
      });
  
      const { name, email, password } = registerBodySchema.parse(request.body);

      try {
        const registerUserUseCase = new RegisterUserUseCase();
        await registerUserUseCase.execute({ name, email, password });

      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: error.message
            });
        }

        return reply.status(500).send();
      }
      
      reply.status(200).send();
}