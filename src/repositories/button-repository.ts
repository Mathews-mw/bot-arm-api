import { Button } from 'johnny-five';

export class ButtonRepository {
	button: Button;

	constructor(data: { pin: number; isPullup: boolean }) {
		this.button = new Button({
			pin: data.pin,
			isPullup: data.isPullup,
		});
	}
}
