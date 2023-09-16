Deno.test('e2e-uniffo', function e2eUniffo() {
	const command = new Deno.Command(Deno.execPath(), {
		args: ['task', 'uniffo'],
	});

	command.spawn();

	command.outputSync();
});
