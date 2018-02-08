import fs from 'fs';
import path from 'path';
import util from 'util';

const readFile = util.promisify(fs.readFile);

import Ruleset from './';

import {
	ConfigureFileJSON,
} from './JSONInterface';

/**
 * TODO: use cosmiconfig?
 * TODO: support YAML
 * TODO: fetch from internet
 *
 * @param extendRule extend rule file
 */
export default async function extendsRuleResolver (extendRule: string, baseRuleFilePath: string) {
	let jsonStr: string;
	let ruleFilePath: string;
	if (/^markuplint\/[a-z0-9-]+(?:\.json)?$/.test(extendRule)) {
		const matched = extendRule.match(/^markuplint\/([a-z0-9-]+)(?:\.json)?$/);
		if (!matched || !matched[1]) {
			throw new Error(`Invalid rule name set extends "${extendRule}" in markuplint`);
		}
		const id = matched[1];
		const filePath = path.join(__dirname, '..', '..', 'rulesets', `${id}.json`);
		jsonStr = await readFile(filePath, 'utf-8');
		ruleFilePath = filePath;
	} else if (/^(?:https?:)?\/\//.test(extendRule)) {
		// TODO: fetch from internet
		throw new Error(`Unsupported external network. Can not fetch ${extendRule}`);
	} else {
		if (baseRuleFilePath === Ruleset.NOFILE) {
			return {
				ruleConfig: null,
				ruleFilePath: Ruleset.NOFILE,
			};
		}
		const dir = path.dirname(baseRuleFilePath);
		const filePath = path.resolve(path.join(dir, extendRule));
		try {
			jsonStr = await readFile(filePath, 'utf-8');
			ruleFilePath = filePath;
		} catch (err) {
			throw new Error(`Extended rc file "${filePath}" is not found`);
		}
	}

	const ruleConfig: ConfigureFileJSON = JSON.parse(jsonStr);
	return { ruleConfig, ruleFilePath };
}
