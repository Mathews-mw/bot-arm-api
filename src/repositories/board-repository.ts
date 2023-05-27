import { Board } from 'johnny-five';
import { IBoardRepository, ICreateBoardRequest } from './implementations/IBoardRepository';
import { SerialPort } from 'serialport';

export class BoardRepository implements IBoardRepository {
	public board: Board;
	public serialPort: SerialPort;

	constructor() {
		this.serialPort = new SerialPort({
			baudRate: 57600,
			highWaterMark: 256,
			path: 'COM5',
		});

		this.board = new Board({ port: this.serialPort });
	}

	create({ port, ...rest }: ICreateBoardRequest): Promise<Board> {
		throw new Error('Method not implemented.');
	}

	closeBoard(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
