const lib = require('./lib');

/**
 * @description Given two resources, calculate how many of the second one is in the first one's recipes.
 * @param {lib.Resource} toCalc The resource whose recipe is to be looped over
 * @param {lib.Resource} res The resource to be matched
 * @example
 * AL.howMany(AL.AIRobot, AL.Circuit);
 * // → 1030
 */
const howMany = (toCalc, res) => {
	let accumulated = 0;
	if (toCalc.isRoot) { }
	else if (toCalc === res) accumulated = 1;
	else if (!(new res() instanceof lib.Resource)) throw new TypeError("You must search for something that is not undefined.")
	else if (!(new toCalc() instanceof lib.Resource)) throw new TypeError("The item whose recipe is to navigate must be a subclass of Resource.")
	else {
		for (let resource of toCalc.recipe.ingredients) {
			if (res === resource)
				accumulated++;
			else {
				accumulated += howMany(resource, res);
			}
		}
	}
	return accumulated;
}
exports.howMany = howMany;

/**
 * @description Given a resource and an array of resources, calculate how many of each item in the array is in the first one's recipes.
 * @param {lib.Resource} toCalc The resource whose recipe is to be looped over
 * @param {lib.Resource[]} res The resources to be matched
 * @example
 * AL.howManyMultiple(AL.AIRobot, [AL.Circuit, AL.Engine])
 * // → { Circuit: 1030, Engine: 560 }
 */
const howManyMultiple = (toCalc, res) => {
	let accumulated = {};
	for (let w of res) {
		accumulated[w.name] = howMany(toCalc, w);
	}
	return accumulated;
}
exports.howManyMultiple = howManyMultiple;

/**
 * @description Given a resource, calculate how many of each root resource are in said resource's recipes.
 * @param {lib.Resource} toCalc The resource whose recipe is to be looped over
 * @example
 * AL.howManyRoots(AL.AIRobot);
 * // →
 * // {
 * //   Aluminum: 2920,
 * //   Copper: 2495,
 * //   Diamond: 0,
 * //   Gold: 1665,
 * //   Iron: 1480
 * // }
 */
const howManyRoots = (toCalc) => {
	return howManyMultiple(toCalc, [
		lib.Aluminum,
		lib.Copper,
		lib.Diamond,
		lib.Gold,
		lib.Iron
	]);
}
exports.howManyRoots = howManyRoots;