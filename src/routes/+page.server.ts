import { Socket, io } from 'socket.io-client';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import type { DefaultEventsMap } from '@socket.io/component-emitter';

/**
 * @type {import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>}
 */
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

// @ts-ignore
export const load = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');

	socket = io('ws://localhost:5173');

	return {
		userId: locals?.user?.id?.toString(),
		username: locals?.user?.username
	};
};

export const actions = {
	// @ts-ignore
	chat: async ({ locals, request }) => {
		if (!locals.user && !locals.session) {
			return { status: 401, message: 'No User or Session exists' };
		}

		const formData = await request.formData();
		const message = formData.get('someText');

		socket.emit('messages', {
			userId: locals?.user?.id,
			username: locals?.user?.username,
			message,
			sent_on: new Date().getTime()
		});

		return { status: 200 };
	},
	// @ts-ignore
	logout: async ({ locals, cookies }) => {
		if (!locals?.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/login');
	}
};
