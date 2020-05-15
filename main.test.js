const AL = require('./index');
const chalk = require('chalk');

let hasFailed;

class AssertionError extends Error { }

function test(name, func) {
	try {
		func();
		console.log(chalk.bgGreenBright.black('PASS'), name);
	} catch (e) {
		console.log(chalk.bgRedBright.whiteBright('FAIL'), name);
		console.log(e);
		hasFailed = true;
	}
	console.log();
}

/**
 * @description Throws if false.
 * @param {boolean} a What to test for
 */
function beTrue(a) {
	if (a === true)
		return true;
	else
		throw new AssertionError(`${a} is not true!`);
}

/**
 * @description Throws if true.
 * @param {boolean} a What to test for
 */
function beFalse(a) {
	if (a === false)
		return true;
	else
		throw new AssertionError(`${a} is not false!`);
}

/**
 * @description Throws if f doesn't throw.
 * @param {function} f What to test for
 */
function doThrow(f) {
	try {
		f()
	} catch {
		return;
	}
	throw new AssertionError(`${f} should have thrown!`);
}

test('No resource shouldn\'t be equal to the base Resource', () => {
	beFalse(new AL.None().toString() === new AL.Resource().toString());
});

test('Recipes must have a maximum of three resources', () => {
	doThrow(() => {
		AL.Recipe([
			AL.Aluminum,
			AL.Circuit,
			AL.Copper,
			AL.AIRobot,
		]);
	});
});

test('Two equally-defined recipes should be equal', () => {
	const rec1 = AL.RecipeGen([
		AL.Antenna,
		AL.AIRobot
	]), rec2 = AL.RecipeGen([
		AL.Antenna,
		AL.AIRobot
	]);
	beTrue(rec1.equal(rec2));
});

test('Two differently-defined recipes shouldn\'t be equal', () => {
	const rec1 = AL.RecipeGen([
		AL.TV,
		AL.Drill
	]), rec2 = AL.RecipeGen([
		AL.Jackhammer
	]);
	beFalse(rec1.equal(rec2));
});

if (hasFailed) throw new Error('Tests failed!')