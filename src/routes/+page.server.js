import { io } from 'socket.io-client';

const socket = io('ws://localhost:5173');

export const actions = {
	chat: async ({ request }) => {
		const formData = await request.formData();
		const message = formData.get('someText');

		socket.emit('messages', message);

		return { status: 200 };
	}
};
