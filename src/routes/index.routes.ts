import { FastifyInstance } from 'fastify';

import { servoRoutes } from './servo.routes';

import { servoController } from '@/controllers/servo-controller';
import { startupController } from '@/controllers/startup-controller';
import { joystickController } from '@/controllers/joystick-controller';

export async function routes(app: FastifyInstance) {
	// socket routes
	app.register(startupController);
	app.register(servoController);
	app.register(joystickController);

	// http routes
	app.register(servoRoutes, { prefix: '/servo' });
}
