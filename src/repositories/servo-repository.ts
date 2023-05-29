import { Servo } from 'johnny-five';

interface IServoProps {
	pin: number;
	startAt: number;
	minPosition: number;
	maxPosition: number;
	type: 'standard' | 'continuous';
	isInverted?: boolean;
}

export class ServoRepository {
	servo: Servo;
	minPosition: number;
	maxPosition: number;
	startAt: number;

	constructor({ pin, startAt, minPosition, maxPosition, type, isInverted = false }: IServoProps) {
		this.servo = new Servo({
			pin,
			isInverted,
			startAt,
			range: [minPosition, maxPosition],
			type,
		});

		this.startAt = startAt;
		this.minPosition = minPosition;
		this.maxPosition = maxPosition;
	}
}
