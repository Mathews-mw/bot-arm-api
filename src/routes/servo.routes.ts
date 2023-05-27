import { emmitDataController } from '@/controllers/emmit-data-controller';
import { moveServoController } from '@/controllers/move-servo-controller';
import { servoController } from '@/controllers/servo-controller';
import { FastifyInstance } from 'fastify';

export async function servoRoutes(app: FastifyInstance) {
	app.post('/connection', servoController);
	app.post('/emmit', emmitDataController);

	app.post('/', moveServoController);
}
