import { Servo } from 'johnny-five';

export class ServoLeftRepository {
	servo: Servo;
	public minPosition = 30;
	public maxPosition = 120;

	constructor() {
		this.servo = new Servo({
			pin: 9,
			startAt: 90,
			range: [this.minPosition, this.maxPosition],
			type: 'continuous',
		});
	}

	async restart() {
		this.servo.home();
	}
}
