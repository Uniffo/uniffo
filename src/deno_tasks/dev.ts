import debounce from "npm:lodash.debounce"

const watcher = Deno.watchFs(["src"]);

const delay = 50;

const pathExist = (path: string) => {
	try {
		Deno.statSync(path)

		return true;
	} catch {
		return false;
	}
};

const dispatchEvent = debounce((event: Deno.FsEvent) => {
  for (const path of event.paths) {
    const pathSegments = path.split('/');
    const dirname = pathSegments.slice(0, pathSegments.length - 1).join('/');
    const basename = pathSegments.slice(-1)[0];
    const ext = basename.split('.').slice(-1)[0];

    if(ext != 'ts') {
      continue;
    }

    let runFilename = "";

    if(basename.includes('.test.ts')) {
      runFilename = path;
    } else {
      runFilename = `${dirname}/${basename.replace(`.${ext}`, `.test.${ext}`)}`
    }

    if (!pathExist(runFilename)) {
      continue
    }

    const cmd = new Deno.Command(Deno.execPath(), {
      args: ['test', ...Deno.args, runFilename, '--', '--debug']
    });

    console.clear();

    cmd.spawn();
  }
}, delay);

for await (const event of watcher) {
  dispatchEvent(event);
}