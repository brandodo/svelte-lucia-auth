<script>
	import { enhance } from '$app/forms';
</script>

<form on:submit|preventDefault method="POST" action="?/login" use:enhance>
	<h1>LOGIN</h1>
	<input placeholder="Username" type="text" name="username" />
	<input placeholder="Password" type="password" name="password" />
	<button>LOGIN</button>
</form>

<style>
	* {
		font-family: Arial, Helvetica, sans-serif;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		justify-content: center;
		align-items: center;
	}

	input {
		height: 45px;
		width: 200px;
		border-radius: 10px;
	}

	button {
		width: 200px;
		height: 30px;
		border-radius: 10px;
	}
</style>
