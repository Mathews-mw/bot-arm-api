import buttonsConfig from '@/config/buttons-config';
import { ButtonRepository } from '@/repositories/button-repository';

let buttonPrimaryInstance: ButtonRepository;
let buttonSecondaryInstance: ButtonRepository;

const { buttonPrimary, buttonSecondary } = buttonsConfig;

export function makeButtonsInstances() {
	buttonPrimaryInstance = new ButtonRepository({
		pin: buttonPrimary.pin,
		isPullup: buttonPrimary.isPullup,
	});

	buttonSecondaryInstance = new ButtonRepository({
		pin: buttonSecondary.pin,
		isPullup: buttonSecondary.isPullup,
	});
}
export { buttonPrimaryInstance, buttonSecondaryInstance };
