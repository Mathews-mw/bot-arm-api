import { Board, Servo } from 'johnny-five';

interface RequestServoUseCase {
	position: number;
}

export class MoveServoUseCase {
	async execute(servo: Servo, data: RequestServoUseCase) {
		const { position } = data;
		let posAux: number;

		servo.to(position, 100);
	}
}
