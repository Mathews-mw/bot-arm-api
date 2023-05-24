import { make } from '@/useCases/factories/make';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function moveServoController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const moveServoUseCase = make();

		const ports = await moveServoUseCase.execute();

		return reply.send({ ports });
	} catch (error) {
		console.log('error: ', error);
		return reply.status(500).send();
	}
}
