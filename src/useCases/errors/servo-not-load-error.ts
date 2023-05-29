export class ServoNotLoadError extends Error {
	constructor() {
		super('Servo ainda não carregou');
	}
}
