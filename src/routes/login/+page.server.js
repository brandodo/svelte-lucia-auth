// @ts-nocheck
import { MONGODB_NAME, MONGODB_URI } from '$env/static/private';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		// User input validation
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}

		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		// Connect to mongo once user input is validated
		const client = new MongoClient(MONGODB_URI);
		await client.connect();

		const db = client.db(MONGODB_NAME);
		const User = db.collection('users');

		const foundUser = await User.findOne({ username });

		if (!foundUser) {
			return fail(400, {
				message: 'Username not found, or password is incorrect'
			});
		}

		const validPassword = password === foundUser.password;

		if (!validPassword) {
			return fail(400, {
				message: 'Username not found, or password is incorrect'
			});
		}

		const session = await lucia.createSession(foundUser._id, {
			username: foundUser.username
		});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
