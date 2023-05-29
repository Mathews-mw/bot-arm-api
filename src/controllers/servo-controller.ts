import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { board } from '@/app';
import { ServoMoveUseCase } from '@/useCases/servo-move-use-case';
import { servoBaseInstance, servoClawInstance, servoLeftInstance, servoRightInstance } from '@/shared/container/servos-instances';

interface IServoRequest {
	positionServoBase?: string;
	positionServoClaw?: string;
	positionServoRight?: string;
	positionServoLeft?: string;
}

interface IResetRequest {
	reset: number;
}

export async function servoController(app: FastifyInstance) {
	app.ready((err) => {
		if (err) {
			throw err;
		}

		app.io.on('connection', (socket) => {
			socket.on('servo-move', async (data: IServoRequest) => {
				const requestDataSchema = z.object({
					positionServoBase: z.optional(z.coerce.number()),
					positionServoClaw: z.optional(z.coerce.number()),
					positionServoRight: z.optional(z.coerce.number()),
					positionServoLeft: z.optional(z.coerce.number()),
				});

				const { positionServoBase, positionServoClaw, positionServoLeft, positionServoRight } = requestDataSchema.parse(data);

				if (board.isReady) {
					if (!servoBaseInstance || !servoRightInstance || !servoLeftInstance || !servoClawInstance) {
						app.io.emit('alert', 'Os Servos ainda não foram carregados. Por favor, inicie todos os servos antes de qualquer operação.');
						return;
					}
				}

				if (board.isReady) {
					const servoBaseMove = new ServoMoveUseCase(servoBaseInstance);
					const servoRightMove = new ServoMoveUseCase(servoRightInstance);
					const servoLeftMove = new ServoMoveUseCase(servoLeftInstance);
					const servoClawMove = new ServoMoveUseCase(servoClawInstance);

					try {
						if (positionServoBase) {
							await servoBaseMove.execute(positionServoBase);
						}
						if (positionServoRight) {
							await servoLeftMove.execute(positionServoRight);
						}
						if (positionServoLeft) {
							await servoRightMove.execute(positionServoLeft);
						}
						if (positionServoClaw) {
							await servoClawMove.execute(positionServoClaw);
						}
					} catch (error) {
						console.log('servo base move error: ', error);
						throw error;
					}
				}

				socket.on('disconnect', async () => {
					if (board.isReady) {
						board.on('exit', () => {
							servoBaseInstance.servo.stop();
							servoClawInstance.servo.stop();
							servoRightInstance.servo.stop();
							servoLeftInstance.servo.stop();
						});
					}
				});
			});

			socket.on('servo-reset', async (data: IResetRequest) => {
				if (!servoBaseInstance || !servoRightInstance || !servoLeftInstance || !servoClawInstance) {
					app.io.emit('alert', 'Os Servos ainda não foram carregados. Por favor, inicie todos os servos antes de qualquer operação.');
				}

				if (data.reset === 1) {
					if (board.isReady) {
						const servoBaseMove = new ServoMoveUseCase(servoBaseInstance);
						const servoRightMove = new ServoMoveUseCase(servoRightInstance);
						const servoLeftMove = new ServoMoveUseCase(servoLeftInstance);
						const servoClawMove = new ServoMoveUseCase(servoClawInstance);

						try {
							await servoBaseMove.execute(servoBaseInstance.startAt);
							await servoLeftMove.execute(servoLeftInstance.startAt);
							await servoRightMove.execute(servoRightInstance.startAt);
							await servoClawMove.execute(servoClawInstance.startAt);
						} catch (error) {
							console.log('servo base move error: ', error);
							throw error;
						}
					}
				}
			});
		});
	});
}
