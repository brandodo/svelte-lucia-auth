<script>
	import { enhance } from '$app/forms';
	import { io } from 'socket.io-client';
	import { messages } from '../store';

	const socket = io('ws://localhost:5173');

	/**
	 * @type {string[]}
	 */
	let sent_messages;

	messages.subscribe((value) => {
		sent_messages = value;
	});

	socket.on('messageFromServer', (message) => {
		// @ts-ignore

		messages.update((curr) => [...curr, message]);
		console.log(socket.id);
	});
</script>

<h1>Welcome to SvelteKit</h1>

<form on:submit|preventDefault method="POST" action="?/chat" use:enhance>
	<input type="text" name="someText" />
	<button>Send</button>
</form>

{#each sent_messages as message}
	<p>{message}</p>
{/each}
