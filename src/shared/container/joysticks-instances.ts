import joysticksConfig from '@/config/joysticks-config';
import { JoystickRepository } from '@/repositories/joystick-repository';

let joystickPrimaryInstance: JoystickRepository;
let joystickSecondaryInstance: JoystickRepository;

const { joystickPrimary, joystickSecondary } = joysticksConfig;

export function makeJoysticksInstances() {
	joystickPrimaryInstance = new JoystickRepository({
		horizontalPin: joystickPrimary.pinHorizontal,
		verticalPin: joystickPrimary.pinVertical,
	});

	joystickSecondaryInstance = new JoystickRepository({
		horizontalPin: joystickSecondary.pinHorizontal,
		verticalPin: joystickSecondary.pinVertical,
	});
}
export { joystickPrimaryInstance, joystickSecondaryInstance };
