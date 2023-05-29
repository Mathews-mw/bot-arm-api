import servosConfig from '@/config/servos-config';
import { ServoRepository } from '@/repositories/servo-repository';

let servoBaseInstance: ServoRepository;
let servoClawInstance: ServoRepository;
let servoRightInstance: ServoRepository;
let servoLeftInstance: ServoRepository;

export function makeServosInstances() {
	const { servoBase, servoClaw, servoLeft, servoRight } = servosConfig;

	servoBaseInstance = new ServoRepository({
		pin: servoBase.pin,
		startAt: servoBase.startAt,
		minPosition: servoBase.minPosition,
		maxPosition: servoBase.maxPosition,
		type: 'continuous',
	});

	servoClawInstance = new ServoRepository({
		pin: servoClaw.pin,
		startAt: servoClaw.startAt,
		minPosition: servoClaw.minPosition,
		maxPosition: servoClaw.maxPosition,
		type: 'continuous',
		isInverted: servoClaw.isInverted,
	});

	servoRightInstance = new ServoRepository({
		pin: servoRight.pin,
		startAt: servoRight.startAt,
		minPosition: servoRight.minPosition,
		maxPosition: servoRight.maxPosition,
		type: 'continuous',
	});

	servoLeftInstance = new ServoRepository({
		pin: servoLeft.pin,
		startAt: servoLeft.startAt,
		minPosition: servoLeft.minPosition,
		maxPosition: servoLeft.maxPosition,
		type: 'continuous',
	});
}

export { servoBaseInstance, servoClawInstance, servoRightInstance, servoLeftInstance };
