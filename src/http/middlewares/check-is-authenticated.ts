import { env } from '@/env';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload, verify } from 'jsonwebtoken';

export async function checkIsAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.token;
    
    if (!token) {
      console.log(token);
      return reply.status(401).send({
        error: 'Unauthorized'
      });
    }

    try {

        const user = verify(token, env.JWT_SECRET) as JwtPayload;
        
        request.user = {
          id: user.id
        };
    } catch (err) {
        console.log(err);
        return reply.status(401).send({
            error: 'Unauthorized'
        });
    }

}