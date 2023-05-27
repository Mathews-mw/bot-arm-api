import { BaseServoRepository } from '@/repositories/servo-base-repository';
import { IBaseServoRepository } from '@/repositories/implementations/IBaseServoRepository';
import { Board, Button, Fn, Joystick, Servo } from 'johnny-five';

interface IMoveBaseProps {
	board: Board;
	baseStartPositionInDegrees: number;
}

export async function ServoBaseMove({ board, baseStartPositionInDegrees }: IMoveBaseProps) {
	console.log('called servo base move function ');

	const servoRepository: IBaseServoRepository = new BaseServoRepository({ pin: 6, baseStartPositionInDegrees: 90, range: [0, 180], type: 'continuous' });

	let basePosXInDegress: number;
	let baseAUXPosInDegress = baseStartPositionInDegrees;

	const joystick = new Joystick({
		pins: ['A0', 'A1'],
	});

	const button = new Button({
		pin: 2,
		isPullup: true,
	});

	board.repl.inject({
		button,
		servoRepository,
	});

	joystick.on('change', async () => {
		console.log('into the joystick', joystick.x);
		basePosXInDegress = joystick.x;

		console.log('basePosXInDegress: ', basePosXInDegress);

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

		const { servoPosition } = await servoRepository.move({ positionInDegrees: baseAUXPosInDegress, delay: 100 });

		console.log('servoPosition: ', servoPosition);
	});
}
