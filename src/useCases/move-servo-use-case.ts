import { SerialPort } from 'serialport';

export class MoveServoUseCase {
	async execute() {
		const listPorts = await SerialPort.list();

		const portBiding = await SerialPort.binding.list();
		console.log(portBiding);

		// const port = new SerialPort({ path: '/', baudRate: 9600 });

		return listPorts;
	}
}
