import { Fn } from 'johnny-five';

import { ServoNotLoadError } from './errors/servo-not-load-error';
import { ServoRepository } from '@/repositories/servo-repository';

export class JoystickControlUseCase {
	private position: number;
	private auxPosition: number;
	private joystickMiddlePosition: number;

	constructor(private servoInstance: ServoRepository) {
		this.position = servoInstance.startAt;
		this.auxPosition = servoInstance.startAt;
		this.joystickMiddlePosition = this.servoInstance.maxPosition - (this.servoInstance.maxPosition - this.servoInstance.minPosition) / 2;
	}

	async excecute(joystickAxisValue: number) {
		if (!this.servoInstance.servo) {
			throw new ServoNotLoadError();
		}

		this.position = joystickAxisValue;

		this.position = Fn.map(this.position, -1, 1, this.servoInstance.minPosition, this.servoInstance.maxPosition);

		if (this.position > this.joystickMiddlePosition + 10) {
			this.auxPosition += 2;

			if (this.auxPosition >= this.servoInstance.maxPosition) {
				this.auxPosition = this.servoInstance.maxPosition;
			}
		}

		if (this.position < this.joystickMiddlePosition - 10) {
			this.auxPosition -= 2;

			if (this.auxPosition <= this.servoInstance.minPosition) {
				this.auxPosition = this.servoInstance.minPosition;
			}
		}

		this.servoInstance.servo.to(this.auxPosition);
	}
}
