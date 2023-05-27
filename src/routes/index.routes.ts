import { FastifyInstance } from 'fastify';

import { servoRoutes } from './servo.routes';

import { servoBaseMoveController } from '@/controllers/servo-base-move-controller';
import { servoLeftMoveController } from '@/controllers/servo-left-move-controller';
import { servoRightMoveController } from '@/controllers/servo-right-move-controller';

export async function routes(app: FastifyInstance) {
	// socket routes
	app.register(servoBaseMoveController);
	app.register(servoLeftMoveController);
	app.register(servoRightMoveController);

	// http routes
	app.register(servoRoutes, { prefix: '/servo' });
}
