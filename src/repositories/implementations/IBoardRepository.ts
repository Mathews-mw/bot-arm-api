import { Board, BoardOption } from 'johnny-five';

export interface ICreateBoardRequest extends BoardOption {
	port: string;
}

export interface IBoardRepository {
	create({ port, ...rest }: ICreateBoardRequest): Promise<Board>;
	closeBoard(): Promise<void>;
}
