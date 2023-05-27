import { Servo } from 'johnny-five';

export class ServoBaseRepository {
	servo: Servo;
	public minPosition = 0;
	public maxPosition = 180;

	constructor() {
		this.servo = new Servo({
			pin: 5,
			startAt: 90,
			range: [this.minPosition, this.maxPosition],
			type: 'continuous',
		});
	}

	async restart() {
		this.servo.home();
	}
}
