import { sveltekit } from '@sveltejs/kit/vite';
import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('userJoined', 'A new user has joined the chat');
			socket.on('messages', ({ username, userId, message, sent_on }) => {
				io.emit('messageFromServer', { username, userId, message, sent_on });
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
