import { FastifyInstance } from 'fastify';
import { servoRoutes } from './servo.routes';

export async function routes(app: FastifyInstance) {
	app.register(servoRoutes, { prefix: '/servo' });
}
