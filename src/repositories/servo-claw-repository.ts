import { Servo } from 'johnny-five';

export class ServoClawRepository {
	servo: Servo;
	public minPosition = 0;
	public maxPosition = 30;

	constructor() {
		this.servo = new Servo({
			pin: 10,
			startAt: 15,
			range: [this.minPosition, this.maxPosition],
			type: 'continuous',
		});
	}

	async restart() {
		this.servo.home();
	}
}
