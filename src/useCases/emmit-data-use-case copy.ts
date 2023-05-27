import { Board, Fn, Joystick, Button, Servo } from 'johnny-five';

interface RequestServoUseCase {
	servoA: string[];
	servoB: string[];
	servoC: string[];
}

export class EmmitDataUseCase {
	async execute(data: RequestServoUseCase) {
		let basePosXInDegress: number;
		let basePosYInDegress: number;
		let baseAUXPosInDegress = 90;

		const board = new Board({
			port: 'COM5',
		});

		board.on('ready', () => {
			const servo = new Servo({
				pin: 6,
				startAt: 90,
				range: [0, 180],
				type: 'continuous',
			});

			const joystick = new Joystick({
				pins: ['A0', 'A1'],
			});

			const button = new Button({
				pin: 2,
				isPullup: true,
			});

			board.repl.inject({
				button,
				servo,
			});

			joystick.on('change', () => {
				basePosXInDegress = joystick.x;
				basePosYInDegress = joystick.y;

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

				servo.to(baseAUXPosInDegress, 100);
				console.log('position: ', servo.position);
			});

			let count = 0;

			button.on('down', function () {
				count++;
			});

			button.on('up', () => {
				console.log(count);
			});
		});
	}
}
