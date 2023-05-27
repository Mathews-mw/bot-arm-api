import { make } from '@/useCases/factories/make';
import { makeEmmitData } from '@/useCases/factories/make-emmit-data';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function emmitDataController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const bodySchema = z.object({
		servoA: z.array(z.string()),
		servoB: z.array(z.string()),
		servoC: z.array(z.string()),
	});

	const { servoA, servoB, servoC } = bodySchema.parse(request.body);
	try {
		const emmitDataUseCase = makeEmmitData();

		const ports = await emmitDataUseCase.execute({ servoA, servoB, servoC });

		return reply.send({ ports });
	} catch (error) {
		console.log('error: ', error);
		return reply.status(500).send();
	}
}
