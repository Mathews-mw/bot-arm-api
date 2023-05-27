import { Servo } from 'johnny-five';
import { FastifyInstance } from 'fastify';

import { board } from '@/app';
import {} from '@/repositories/servo-base-repository';
import { ServoLeftRepository } from '@/repositories/servo-left-repository';

interface IBaseServoRequest {
	position: string;
}

export async function servoLeftMoveController(app: FastifyInstance) {
	let servo: Servo;
	let posAux: number;
	let minPositionAllowed: number;
	let maxPositionAllowed: number;

	app.ready((err) => {
		if (err) {
			throw err;
		}

		app.io.on('connection', (socket) => {
			socket.on('servos-initialize', async (data) => {
				if (board.isReady) {
					const servoInstance = new ServoLeftRepository();

					if (data.connect === 1) {
						servo = servoInstance.servo;
						minPositionAllowed = servoInstance.minPosition;
						maxPositionAllowed = servoInstance.maxPosition;

						posAux = servo.position;

						socket.emit('servos-initialize', 'Servo inicializado');
					} else {
						socket.emit('servos-initialize', 'Erro ao inicializar Servo');
					}
				}
			});

			socket.on('servo-left-move', async (data: IBaseServoRequest) => {
				if (!servo) {
					socket.emit('servo-alert', 'O Servo ainda não foi carregado');
					return;
				}

				const positionParse = Number(data.position);

				if (board.isReady) {
					if (positionParse > posAux) {
						const intervalo = setInterval(() => {
							servo.to(posAux);

							posAux++;

							if (posAux > maxPositionAllowed) {
								clearInterval(intervalo);
								servo.to(maxPositionAllowed);
							}

							if (posAux === positionParse) {
								clearInterval(intervalo);
							}
						}, 10);
					}

					if (positionParse < posAux) {
						const intervalo = setInterval(() => {
							servo.to(posAux);

							posAux--;

							if (posAux < minPositionAllowed) {
								clearInterval(intervalo);
								servo.to(minPositionAllowed);
							}

							if (posAux === positionParse) {
								clearInterval(intervalo);
							}
						}, 10);
					}

					if (positionParse === posAux) {
						posAux = positionParse;
					}
				}
			});
		});
	});
}
