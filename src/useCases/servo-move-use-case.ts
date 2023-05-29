import { app } from '@/app';
import { ServoRepository } from '@/repositories/servo-repository';

export class ServoMoveUseCase {
	private positionAux: number;
	private minPositionAllowed: number;
	private maxPositionAllowed: number;

	constructor(private servoInstance: ServoRepository) {
		this.positionAux = servoInstance.servo.position;
		this.minPositionAllowed = servoInstance.minPosition;
		this.maxPositionAllowed = servoInstance.maxPosition;
	}

	async execute(position: number): Promise<void> {
		if (position > this.positionAux) {
			const intervalo = setInterval(() => {
				this.servoInstance.servo.to(this.positionAux);

				this.positionAux++;

				if (this.positionAux > this.maxPositionAllowed) {
					app.io.emit('error', `A posição máxima permitida para esse servo é ${this.maxPositionAllowed}`);

					clearInterval(intervalo);
					this.servoInstance.servo.to(this.maxPositionAllowed);

					return;
				}

				if (this.positionAux === position) {
					clearInterval(intervalo);
				}
			}, 10);
		}

		if (position < this.positionAux) {
			const intervalo = setInterval(() => {
				this.servoInstance.servo.to(this.positionAux);

				this.positionAux--;

				if (this.positionAux < this.minPositionAllowed) {
					app.io.emit('error', `A posição mínima permitida para esse servo é ${this.minPositionAllowed}`);

					clearInterval(intervalo);
					this.servoInstance.servo.to(this.minPositionAllowed);

					return;
				}

				if (this.positionAux === position) {
					clearInterval(intervalo);
				}
			}, 10);
		}

		if (position === this.positionAux) {
			this.positionAux = position;
		}
	}
}
