import { FastifyInstance } from 'fastify';

import { board, serialPort } from '@/app';
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
			socket.on('startup', async (data: IConnectRequest) => {
				console.log(data);
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

							console.log(serialPort.isOpen);
							socket.emit('message', 'O braço robótico está pronto para ser operado.');
							socket.emit('startup-sucess', { connected: true });
						} catch (error) {
							console.log(error);
							app.io.emit('error', 'Erro ao inicializar.');
							socket.emit('startup-sucess', { connected: false });
						}
					}

					if (data.connect === 0) {
						socket.emit('startup-sucess', { connected: false });

						await serialPort.pause();
						await serialPort.close();

						console.log(await board.isReady);

						board.on('exit', () => {
							console.log('desligando a placa');
						});

						console.log(await serialPort.isOpen);
					}
				}
			});
		});
	});
}
