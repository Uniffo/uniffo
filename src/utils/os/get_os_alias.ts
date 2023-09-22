export const getOsAlias = (
	_os?: typeof Deno.build.os,
	_arch?: typeof Deno.build.arch,
): 'linux_x64' | 'macos_x64' | 'macos_arm' | 'Os not recognized' => {
	const os = _os || Deno.build.os;
	const arch = _arch || Deno.build.arch;

	if (os === 'linux' && arch === 'x86_64') {
		return 'linux_x64';
	} else if (os === 'darwin' && arch === 'x86_64') {
		return 'macos_x64';
	} else if (os === 'darwin' && arch === 'aarch64') {
		return 'macos_arm';
	} else {
		return 'Os not recognized';
	}
};
