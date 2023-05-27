import { Joystick } from 'johnny-five';

export function letsTest() {
	const joystick = new Joystick({
		pins: ['A0', 'A1'],
	});

	joystick.on('change', () => {
		console.log('x: ', joystick.x);
		console.log('y: ', joystick.y);
	});
}
