import { MONGODB_URI, MONGODB_NAME } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';

export const actions = {
	// @ts-ignore
	register: async ({ request }) => {
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

		if (foundUser) {
			return {
				status: 401,
				error: 'Username already exists'
			};
		} else {
			await User.insertOne({ username, password });
			redirect(302, '/login');
		}
	}
};
