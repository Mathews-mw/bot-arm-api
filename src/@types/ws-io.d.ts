import { EventNames } from 'socket.io/dist/typed-events';

interface EventsTest {
	error: string;
	testes: string;
}

declare module 'socket.io/dist/typed-events' {
	export type EventNames = keyof EventsTest;
}
