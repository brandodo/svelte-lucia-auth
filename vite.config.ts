import { sveltekit } from '@sveltejs/kit/vite';
import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			console.log('user connected');
			socket.emit('eventFromServer', 'LETS GOOOO');

			socket.on('messages', (message) => {
				console.log('sending message', message);
				// do some server db actions

				io.emit('messageFromServer', message);
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
