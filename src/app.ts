import cors from '@fastify/cors';

import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { routes } from './routes/index.routes';

export const app = fastify();

app.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});
app.register(routes, { prefix: '/api' });

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Validation error', issues: error.format() });
	}

	if (env.NODE_ENV !== 'production') {
		console.log('handler error:', error);
	}

	return reply.status(500).send({ message: 'Internal server error.' });
});
