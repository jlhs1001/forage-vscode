import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as forage from '../../extension';
import * as pruner from '../../Pruner';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Regex tests', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
	test('Forage search test with multiple matches', () => {
		assert.deepStrictEqual(pruner.delimSearch("hello", "abc hello hello xyz"), [4, 10]);
		assert.deepStrictEqual(pruner.delimSearch("ll", "llabc hello hello xyzll"), [0, 8, 14, 21]);

	});

	test('Forage search test with 2 matches overlapping matches', () => {

		assert.deepStrictEqual(pruner.delimSearch("ll", "lll ll"), [0, 4]);

	});

	test('Forage search test with no matches', () => {
		assert.deepStrictEqual(pruner.delimSearch("fish", "abc hello hello xyz"), []);
	});
	
	test('Forage search test with 1 match', () => {
		assert.deepStrictEqual(pruner.delimSearch("hello", " hello"), [1]);
	});

	test('Forage search test with a delimiter of length 1', () => {
		assert.deepStrictEqual(pruner.delimSearch("h", "hello h 97h"), [0, 6, 10]);
	});

	test('Forage match highlight test with 2 matches', () => {
		assert.deepStrictEqual(pruner.highlight(pruner.delimSearch("h", "h hello"), "h", "h hello"), [`<span class="highlight">h</span> <span class="highlight">h</span>ello`, true]);
	});

	test('Forage match highlight test with no matches', () => {
		assert.deepStrictEqual(pruner.highlight(pruner.delimSearch("j", "h hello"), "j", "h hello"), [`h hello`, false]);
	});

	test('Forage regex highlight test with 2 matches', () => {
		assert.deepStrictEqual(pruner.highlightRegex("[0-9]+", "97 hello 53"),  [`<span class="highlight">97</span> hello <span class="highlight">53</span>`, true]);
	});
});
