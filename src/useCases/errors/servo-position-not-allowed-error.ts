export class ServoPositionNotAllowedError extends Error {
	constructor(data: { typePosition: 'mínima' | 'máxima'; allowedPosition: number }) {
		super(`A posição ${data.typePosition} permitida para esse servo é ${data.allowedPosition}`);
	}
}
