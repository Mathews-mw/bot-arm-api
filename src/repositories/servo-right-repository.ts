import { Servo } from 'johnny-five';

export class ServoRightRepository {
	servo: Servo;
	public minPosition = 45;
	public maxPosition = 135;

	constructor() {
		this.servo = new Servo({
			pin: 6,
			startAt: 90,
			range: [this.minPosition, this.maxPosition],
			type: 'continuous',
		});
	}

	async restart() {
		this.servo.home();
	}
}
