import { Board, Joystick, Button, Servo } from 'johnny-five';
import { SerialPort } from 'serialport';

interface RequestServoUseCase {
	servoA: string[];
	servoB: string[];
	servoC: string[];
}

function connectBoard(port: string, angle: number) {
	return new Promise<void>((resolve) => {
		const serialport = new SerialPort({
			baudRate: 57600,
			highWaterMark: 256,
			path: port,
		});

		console.log('port status: ', serialport.isOpen);
		const board = new Board({ port: serialport });
		board.on('ready', () => {
			const servo = new Servo({
				pin: 6,
				range: [0, 180],
				// center: true,
				type: 'continuous',
			});

			board.repl.inject({
				servo,
			});

			servo.cw(1);

			console.log('angle: ', servo.position);
			serialport.close();
			resolve();
		});
	});
}

export class ServoUseCase {
	async execute(data: RequestServoUseCase) {
		// const port = (await SerialPort.list())
		// 	.map(({ path }) => path)
		// 	.filter((port) => {
		// 		return /usb|acm|^com/i.test(port);
		// 	})[0];

		await connectBoard('COM5', Number(data.servoA[0]));
	}
}
