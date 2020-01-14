import * as markuplint from 'markuplint';

test('is test 1', async () => {
	const r = await markuplint.verify(
		`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>Document</title>
		</head>
		<body>
			<p>This document did not have heading.</p>
		</body>
		</html>`,
		{
			rules: {
				axe: true,
			},
		},
		// Auto loading
		[],
		'en',
	);
	expect(r).toStrictEqual([
		// {
		// 	severity: 'warning',
		// 	ruleId: 'textlint',
		// 	line: 12,
		// 	col: 20,
		// 	raw: 'jquery',
		// 	message: 'Invalid text: jquery => jQuery',
		// },
	]);
});
