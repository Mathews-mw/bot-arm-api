import { moveServoController } from '@/controllers/move-servo-controller';
import { FastifyInstance } from 'fastify';

export async function servoRoutes(app: FastifyInstance) {
	app.get('/', moveServoController);
}
