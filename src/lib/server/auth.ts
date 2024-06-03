import { Lucia } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { Collection, MongoClient } from 'mongodb';
import { dev } from '$app/environment';

const client = new MongoClient();
await client.connect();

const db = client.db();
const User = db.collection('users') as Collection<UserDoc>;
const Session = db.collection('sessions') as Collection<SessionDoc>;

const adapter = new MongodbAdapter(Session, User);

interface UserDoc {
	_id: string;
}

interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: string;
}

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}
