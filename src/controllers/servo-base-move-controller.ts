import { Servo } from 'johnny-five';
import { FastifyInstance } from 'fastify';

import { board } from '@/app';
import { ServoBaseRepository } from '@/repositories/servo-base-repository';

interface IBaseServoRequest {
	position: string;
}

export async function servoBaseMoveController(app: FastifyInstance) {
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
					const servoInstance = new ServoBaseRepository();

					if (data.connect === 1) {
						servo = servoInstance.servo;
						posAux = servo.position;
						minPositionAllowed = servoInstance.minPosition;
						maxPositionAllowed = servoInstance.maxPosition;

						socket.emit('servos-initialize', 'Servo inicializado');
					} else {
						socket.emit('servos-initialize', 'Erro ao inicializar Servo');
					}

					console.log('aux: ', posAux);
				}
			});

			socket.on('servo-base-move', async (data: IBaseServoRequest) => {
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
						console.log('executou no igual');
						posAux = positionParse;
					}
				}
			});
		});
	});
}
