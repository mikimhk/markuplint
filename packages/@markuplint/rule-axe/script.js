//
// This script is run on `vm` module.
//
export default async function evaluate() {
	global.document = window.document;
	global.window = window;
	global.navigator = window.navigator;
	global.Node = window.Node;
	global.NodeList = window.NodeList;
	global.Element = window.Element;
	global.Document = window.Document;

	const axe = await import('axe-core');

	try {
		const locale = require(`axe-core/locales/${'ja'}.json`);
		axe.configure({ locale });
	} catch (err) {
		// ignore
	}

	const results = await axe.run({
		rules: {
			'color-contrast': { enabled: false },
		},
	});

	return results;
}

// vm.Module.evaluate => { result }
evaluate;
