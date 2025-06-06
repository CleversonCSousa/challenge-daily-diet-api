import { env } from '@/env';
import { prismaClient } from '@/lib/prisma/prismaClient';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IncorretUserCredentials } from '../errors/incorrect-credentials';

interface SigninUseCaseRequest {
    email: string;
    password: string;
}

export class SignInUserUseCase {
    async execute({ email, password } : SigninUseCaseRequest) {
        const user = await prismaClient.user.findUnique({
                where: {
                  email: email,
                }
            });
          
            if (!user) {
                throw new IncorretUserCredentials();
              }
          
            const passwordsMatch = await compare(password, user.password);
          
            if (!passwordsMatch) {
                throw new IncorretUserCredentials();
            }
          
            const token = sign({
                name: user.name,
                email: user.email,
                id: user.id
            }, env.JWT_SECRET);
          
            return {
                token
            };
    }
}