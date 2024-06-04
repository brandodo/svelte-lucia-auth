<script>
	import { enhance } from '$app/forms';
	import { io } from 'socket.io-client';
	import { messages } from '../store';

	export let data;
	/**
	 * @type {string}
	 */
	let newUserMessage;
	const { userId, username } = data;

	const socket = io('ws://localhost:5173');

	/**
	 * @type {any[]}
	 */
	let sent_messages;

	messages.subscribe((value) => {
		sent_messages = value.reverse();
	});

	socket.on('messageFromServer', (message) => {
		// @ts-ignore
		messages.update((curr) => [...curr, message].sort((a, b) => a.sent_on - b.sent_on));
	});

	socket.on('userJoined', (message) => {
		newUserMessage = message;

		setTimeout(() => {
			newUserMessage = '';
		}, 3000);
	});
</script>

<section>
	<header>
		<h1>Welcome to SvelteChat, logged in as <span>{username}</span></h1>

		<form on:submit|preventDefault method="POST" action="?/logout" use:enhance>
			<button class="logoutButton">Logout</button>
		</form>
	</header>

	{#if newUserMessage}
		<p>{newUserMessage}</p>
	{/if}
	<div class="messagesContainer">
		{#if sent_messages?.length > 0}
			{#each sent_messages as message}
				<div class={userId === message?.userId ? 'sender' : 'receiver'}>
					<p class="messageUsername">User: {message?.username}</p>
					<p class="messageText">{message?.message}</p>
					<p class="messageTimestamp">
						{new Date(message?.sent_on).toDateString()} at {new Date(
							message?.sent_on
						).getHours()}:{new Date(message?.sent_on).getMinutes()}
					</p>
				</div>
			{/each}
		{/if}
	</div>

	<form class="inputContainer" on:submit|preventDefault method="POST" action="?/chat" use:enhance>
		<div class="chatInput">
			<input placeholder="Enter a message..." type="text" name="someText" />
			<button>Send</button>
		</div>
	</form>
</section>

<style>
	* {
		font-family: Arial, Helvetica, sans-serif;
	}

	section {
		height: 700px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.inputContainer {
		display: flex;
		align-items: flex-end;
		flex: 1;
	}

	.chatInput {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		width: 100%;
	}

	input {
		height: 35px;
		border-radius: 10px;
		flex: 1;
	}

	button {
		height: 40px;
		border-radius: 10px;
		width: 100px;
		background-color: lightgreen;
		font-size: 20px;
	}

	span {
		font-size: 30px;
		color: green;
	}

	.messagesContainer {
		display: flex;
		height: 800px;
		overflow-y: scroll;
		flex-direction: column-reverse;
		gap: 15px;
		padding: 20px;
	}

	.messageUsername {
		font-weight: bold;
		font-size: 20px;
	}

	.messageText {
		font-size: 20px;
	}

	.sender {
		padding: 5px 20px;
		width: 250px;
		border-radius: 10px;
		background-color: #0695ff;
		align-self: flex-end;
	}

	.receiver {
		padding: 5px 20px;
		width: 250px;
		border-radius: 10px;
		background-color: lightgray;
	}

	.logoutButton {
		background-color: lightgray;
	}
</style>
