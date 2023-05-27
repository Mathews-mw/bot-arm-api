export interface IMoveRequest {
	positionInDegrees: number;
	delay?: number;
}

interface IMoveResponse {
	servoPosition: number;
}

export interface IBaseServoRepository {
	move(data: IMoveRequest): Promise<IMoveResponse>;
	reset(data: any): Promise<void>;
}
