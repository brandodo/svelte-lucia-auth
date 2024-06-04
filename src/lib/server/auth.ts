import { Lucia } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { Collection, MongoClient } from 'mongodb';
import { dev } from '$app/environment';
import { MONGODB_URI, MONGODB_NAME } from '$env/static/private';

const client = new MongoClient(MONGODB_URI);
await client.connect();

const db = client.db(MONGODB_NAME);
const User = db.collection('users') as Collection<UserDoc>;
const Session = db.collection('sessions') as Collection<SessionDoc>;

const adapter = new MongodbAdapter(Session, User);

interface UserDoc {
	_id: string;
	username: string;
}

interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: string;
}

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			username: attributes?.username
		};
	},
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}
