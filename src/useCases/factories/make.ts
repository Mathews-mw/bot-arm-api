import { MoveServoUseCase } from '../move-servo-use-case';

export function make() {
	const moveServoUseCase = new MoveServoUseCase();

	return moveServoUseCase;
}
