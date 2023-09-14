Deno.test('entry', () => {
	const command = new Deno.Command(Deno.execPath(), {
		args: ['task', 'uniffo', '--message', 'testowy message'],
	});

	command.spawn();

	command.outputSync();
});
