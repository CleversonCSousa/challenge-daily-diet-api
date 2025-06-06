import { prismaClient } from '@/lib/prisma/prismaClient';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from '../errors/user-already-exists';
import { sign } from 'jsonwebtoken';
import { env } from '@/env';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserUseCase {
    async execute({ name, email, password }: RegisterUseCaseRequest) {
        const userWithSameEmail = await prismaClient.user.findUnique({
            where: {
                email,
            },
        });

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const password_hash = await hash(password, 6);

        const { id } = await prismaClient.user.create({
            data: {
                name,
                email,
                password: password_hash,
            },
        });

        const token = sign(
            {
                name,
                email,
                id,
            },
            env.JWT_SECRET
        );

        return {
            token,
        };
    }
}
