import { BoardRepository } from '@/repositories/board-repository';
import { IBoardRepository } from '@/repositories/implementations/IBoardRepository';
import { letsTest } from '@/utils/servo/lets-test';
import { ServoBaseMove } from '@/utils/servo/servo-base-move';
import { Board, Fn, Joystick, Button, Servo } from 'johnny-five';
import { SerialPort } from 'serialport';

interface RequestServoUseCase {
	servoA: string[];
	servoB: string[];
	servoC: string[];
}

export class EmmitDataUseCase {
	async execute(data: RequestServoUseCase) {
		let basePosXInDegress: number;
		let baseAUXPosInDegress = 90;

		const serialPort = new SerialPort({
			baudRate: 57600,
			highWaterMark: 256,
			path: 'COM5',
			autoOpen: false,
		});

		const board = new Board({
			port: serialPort,
		});

		board.on('ready', () => {
			console.log('board is ready: ', board.isReady);
			const joystick = new Joystick({
				pins: ['A0', 'A1'],
			});

			const button = new Button({
				pin: 2,
				isPullup: true,
			});

			board.repl.inject({
				button,
			});

			joystick.on('change', async () => {
				basePosXInDegress = joystick.x;

				basePosXInDegress = Fn.map(basePosXInDegress, -1, 1, 0, 180);

				if (basePosXInDegress > 100) {
					baseAUXPosInDegress += 2;

					if (baseAUXPosInDegress >= 180) {
						baseAUXPosInDegress = 180;
					}
				}

				if (basePosXInDegress < 80) {
					baseAUXPosInDegress -= 2;

					if (baseAUXPosInDegress <= 0) {
						baseAUXPosInDegress = 0;
					}
				}

				// console.log('basePosXInDegress: ', basePosXInDegress);
			});

			let count = 0;
			button.on('down', function () {
				count++;

				serialPort.close();
			});

			button.on('up', () => {
				console.log(count);
			});
		});
	}
}
