import { Result, createRule } from '@markuplint/ml-core';
import { AxeResults } from 'axe-core';
import { JSDOM } from 'jsdom';
import { runInContextOnFile } from './vm';

type Option = {};

const severity: Record<'minor' | 'moderate' | 'serious' | 'critical', 'error' | 'warning'> = {
	critical: 'error',
	serious: 'error',
	moderate: 'warning',
	minor: 'warning',
};

export default createRule<boolean, Option>({
	name: 'axe',
	defaultValue: true,
	defaultOptions: {},
	async verify(mldoc, messages, config) {
		const reports: Result[] = [];
		const html = mldoc.toString();
		const { window } = new JSDOM(html);

		const runner = await runInContextOnFile<() => Promise<AxeResults>>('../script.js', { window });

		const results = await runner();

		for (const report of results.violations) {
			if (report.impact === null) {
				continue;
			}
			console.log(report);

			for (const node of report.nodes) {
				reports.push({
					severity: severity[report.impact || 'critical'],
					message: `${report.help} (${report.helpUrl})`,
					line: 1,
					col: 1,
					raw: node.html,
				});
			}
		}

		return reports;
	},
});
