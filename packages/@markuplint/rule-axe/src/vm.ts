import vm, { Context } from 'vm';
import fs from 'fs';
import path from 'path';

const cache = new Map<string, string>();

export async function runInContextOnFile<R = {}>(filePath: string, context: Context) {
	const filename = path.resolve(__dirname, filePath);
	let code: string;

	if (cache.has(filename)) {
		code = cache.get(filename)!;
	} else {
		code = fs.readFileSync(filename, { encoding: 'utf-8' });
	}

	const newContext: any = {
		global: {},
		...context,
	};

	// @ts-ignore
	const exe = new vm.SourceTextModule(code, { context: vm.createContext(newContext) });

	await exe.link(() => {});

	const r = await exe.evaluate();

	// @ts-ignore
	return r.result as R;
}
