import { Joystick } from 'johnny-five';

export class JoystickRepository {
	joystick: Joystick;

	constructor(data: { horizontalPin: string; verticalPin: string }) {
		this.joystick = new Joystick({
			pins: [data.horizontalPin, data.verticalPin],
		});
	}
}
