import { FastifyInstance } from 'fastify';

import { board } from '@/app';
import { ServoMoveUseCase } from '@/useCases/servo-move-use-case';
import { buttonPrimaryInstance } from '@/shared/container/buttons-instances';
import { JoystickControlUseCase } from '@/useCases/joystick-control-use-case';
import { joystickPrimaryInstance, joystickSecondaryInstance } from '@/shared/container/joysticks-instances';
import { servoBaseInstance, servoClawInstance, servoLeftInstance, servoRightInstance } from '@/shared/container/servos-instances';

interface IJoystickControllRequest {
	start: number;
}

export async function joystickController(app: FastifyInstance) {
	app.ready((err) => {
		if (err) {
			throw err;
		}

		app.io.on('connection', (socket) => {
			socket.on('joystick-control', async (data: IJoystickControllRequest) => {
				if (board.isReady) {
					if (!servoBaseInstance || !servoRightInstance || !servoLeftInstance || !servoClawInstance) {
						app.io.emit('alert', 'Os Servos ainda não foram carregados. Por favor, inicie todos os servos antes de qualquer operação.');
						return;
					}

					if (!joystickPrimaryInstance || !joystickSecondaryInstance || !buttonPrimaryInstance) {
						app.io.emit('alert', 'Os joysticks ainda não foram carregados.');
						return;
					}

					if (data.start === 1) {
						const joystickControlServoBase = new JoystickControlUseCase(servoBaseInstance);
						const joystickControlServoCalw = new JoystickControlUseCase(servoClawInstance);
						const joystickControlServoRight = new JoystickControlUseCase(servoRightInstance);
						const joystickControlServoLeft = new JoystickControlUseCase(servoLeftInstance);

						joystickPrimaryInstance.joystick.on('change', async () => {
							await joystickControlServoBase.excecute(joystickPrimaryInstance.joystick.x);
							await joystickControlServoRight.excecute(joystickPrimaryInstance.joystick.y);
						});

						joystickSecondaryInstance.joystick.on('change', async () => {
							await joystickControlServoLeft.excecute(joystickSecondaryInstance.joystick.y);
							await joystickControlServoCalw.excecute(joystickSecondaryInstance.joystick.x);
						});

						buttonPrimaryInstance.button.on('down', async () => {
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
						});
					}
				}

				socket.on('disconnect', async () => {
					if (board.isReady) {
						servoBaseInstance.servo.stop();
						servoClawInstance.servo.stop();
						servoRightInstance.servo.stop();
						servoLeftInstance.servo.stop();
					}
				});
			});
		});
	});
}
