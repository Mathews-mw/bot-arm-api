import { FastifyInstance } from 'fastify';

import { board } from '@/app';
import { makeButtonsInstances, buttonPrimaryInstance, buttonSecondaryInstance } from '@/shared/container/buttons-instances';
import { joystickPrimaryInstance, joystickSecondaryInstance, makeJoysticksInstances } from '@/shared/container/joysticks-instances';
import { makeServosInstances, servoBaseInstance, servoClawInstance, servoLeftInstance, servoRightInstance } from '@/shared/container/servos-instances';

interface IConnectRequest {
	connect: number;
}

export async function startupController(app: FastifyInstance) {
	app.ready((err) => {
		if (err) {
			throw err;
		}

		app.io.on('connection', (socket) => {
			socket.on('servos-initialize', async (data: IConnectRequest) => {
				if (board.isReady) {
					if (data.connect === 1) {
						try {
							makeServosInstances();
							makeButtonsInstances();
							makeJoysticksInstances();

							if (
								servoBaseInstance &&
								servoClawInstance &&
								servoRightInstance &&
								servoLeftInstance &&
								joystickPrimaryInstance &&
								joystickSecondaryInstance &&
								buttonPrimaryInstance &&
								buttonSecondaryInstance
							) {
								board.repl.inject({
									servoBase: servoBaseInstance.servo,
									servoClaw: servoClawInstance.servo,
									servoRight: servoRightInstance.servo,
									servoLeft: servoLeftInstance.servo,
									joystickPrimary: joystickPrimaryInstance.joystick,
									joystickSecondary: joystickSecondaryInstance.joystick,
									buttonPrimary: buttonPrimaryInstance,
									buttonSecondary: buttonSecondaryInstance,
								});
							}

							socket.emit('message', 'O braço robótico está pronto para ser operado.');
						} catch (error) {
							console.log(error);
							app.io.emit('error', 'Erro ao inicializar.');
						}
					}
				}
			});
		});
	});
}
