import { Board, Button, Fn, Joystick, Servo } from 'johnny-five';

interface IMoveBaseProps {
	board: Board;
	baseStartPositionInDegrees: number;
}

export function ServoBaseMove({ board, baseStartPositionInDegrees }: IMoveBaseProps) {
	let basePosXInDegress: number;
	let baseAUXPosInDegress = baseStartPositionInDegrees;

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
}
