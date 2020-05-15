# AssemblyLine.js

Assembly Line (the game) tools.

## Installation

```shell
npm install assemblyline.js
```

## Usage

```js
const AL = require('assemblyline.js');
```

### `Recipe` (and `RecipeGen`)

#### Creating a recipe / `RecipeGen(arr)`

`RecipeGen` returns a recipe, generated based on the resources you pass.

The array `arr` should be an array of resouce prototypes (that is, like `AL.Aluminum` and not `new AL.Aluminum()`)

If you need more than one of the same item, repeat it in the array. (See: `Resource.repeat()`)

**Don't provide `None`, it will be automatically filled.**

#### `ingredients`

The getter returns an array of resource prototypes like you would have put in `RecipeGen`

The setter works exactly like `RecipeGen`.

#### `toString(isMultiline)`

`toString` by default returns a multiline string with a pink-colored `Recipe` followed by brac, newline, list of materials on seperate lines and closing brace.

Setting the first argument (`isMultiline`) to false returns a single-line version of the same string, but with parentheses instead of braces.

#### `equal(other)`

Checks whether two recipes share the same ingredients, in the same amount and in the same order.

### `Resource`

All members of `Resource` and subclasses are static.

#### `isRoot`

Whether the resource is a 'root' resource (Aluminum, Copper, Diamond, Gold, Iron and None).

#### `sellCost`

Value when sold.

#### `repeat(n)`

Repeats the resource `n` times, and returns an array.

```js
AL.Circuit.repeat(3)
          .map(i => {return i.toString()})
          .forEach(i => {console.log(i)})
/* →
Circuit(300$)
Circuit(300$)
Circuit(300$)
*/
```

#### `toString(level)`

Returns a string representation of the resource.

`level` defaults to `1` and is used to choose the amount of color and formatting in the string.

Suggested:

- `0` for when you are using a string inside of another function which returns a string (one line, all default color)
- `1` for when you are using a string for logging basic information (one line, colored)
- `2` for when you want formatted and extensive logging, like for debugging purposes (multiline, colored)

#### Resources in the library

By default, the library contains all the resources in Assembly Line, including `None`. They are named with this convention:

- `get the item's name`
- `Make It Title Case`
- `RemoveSpaces`

(To reformat into the original name, you can use `String.prototype.unCamel()` which does the steps in reverse and turns `A I` into `AI`.)

### Calculations

#### `howMany(toCalc, res)`

Given two resources `toCalc` and `res`, calculate how many `res`s there are in `toCalc`'s recipes.

```js
AL.howMany(AL.AIRobot, AL.Circuit);
// → 1030
```

#### `howManyMultiple(toCalc, res)`

Given a resource `toCalc` and an array of resources `res`, calculate how many of each `res`'s items there are in `toCalc`'s recipes.

```js
AL.howManyMultiple(AL.AIRobot, [AL.Circuit, AL.Engine]);
// → { Circuit: 1030, Engine: 560 }
```

#### `howManyRoots(toCalc)`

Given a resource `toCalc`, calculate how many of each of the root items (excluding `None`) there are in `toCalc`'s recipes.

> This is a wrapper around `howManyMultiple`

```js
AL.howManyRoots(AL.AIRobot);
// { Aluminum: 2920, Copper: 2495, Diamond: 0, Gold: 1665, Iron: 1480 }
```

## License

MIT
