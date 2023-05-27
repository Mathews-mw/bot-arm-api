import { make } from '@/useCases/factories/make';
import { MoveServoUseCase } from '@/useCases/move-servo-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

export async function moveServoController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const bodySchema = z.object({
		servoA: z.array(z.string()),
		servoB: z.array(z.string()),
		servoC: z.array(z.string()),
	});

	const { servoA, servoB, servoC } = bodySchema.parse(request.body);
	try {
		const moveServoUseCase = new MoveServoUseCase();

		await moveServoUseCase.execute({ servoA, servoB, servoC });

		return reply.send({ message: 'ok' });
	} catch (error) {
		console.log('error: ', error);
		return reply.status(500).send();
	}
}
