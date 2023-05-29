import 'reflect-metadata';

import cors from '@fastify/cors';

import fastify from 'fastify';
import { ZodError } from 'zod';
import { Board } from 'johnny-five';
import socketioServer from 'fastify-socket.io';

import { env } from './env';
import { SerialPort } from 'serialport';
import { routes } from './routes/index.routes';
import { PortInfo } from '@serialport/bindings-cpp';

let serialPort: SerialPort;
let board: Board;

export const app = fastify();

new Promise<PortInfo[]>((resolve, reject) => {
	const ports = SerialPort.list();
	resolve(ports);
})
	.then((data) => {
		const availableSerialPorts = data;

		const searchPort = availableSerialPorts.find((port) => port.productId === '7523');

		if (searchPort) {
			serialPort = new SerialPort({
				baudRate: 57600,
				highWaterMark: 256,
				path: searchPort.path,
			});

			board = new Board({ port: serialPort });
		}
	})
	.catch((error) => {
		console.log(error);
	});

app.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

app.register(socketioServer);

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

export { board };
