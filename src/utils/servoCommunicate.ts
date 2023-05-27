import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export async function servoCommunicate() {
	const port = new SerialPort({ path: 'COM5', baudRate: 9600 });

	const parser = new ReadlineParser({ delimiter: '\r\n' });

	port.pipe(parser);

	const portIsOpen = port.isOpen;

	parser.on('data', (line) => {
		console.log('Arduino disse: ', line);
		port.write('3');
	});
}
