const chalk = require('chalk');

class Dollar extends Number {
	toString() {
		return super.toString() + ' $'
	}
	toNum() {
		return parseFloat(super.toString())
	}
	$() {
		return this;
	}
}

// exports.Dollar = Dollar;

Number.prototype.$ = function () {
	return new Dollar(this)
}

String.prototype.unCamel = function () {
	const arr = this.split('');
	let out = [], acc = '';
	for (let letter of arr) {
		if (letter.toLowerCase() === letter) {
			acc += letter;
		} else {
			out.push(acc);
			acc = letter;
		}
	}
	out.push(acc);
	out.shift();
	return out.join(' ').replace(/A I/, 'AI')
}

class Resource {
	/**
	 * @type {boolean}
	 */
	static isRoot = false;
	/**
	 * @type {Dollar}
	 */
	static #sellCost = (0).$();
	/**
	 * @returns {number}
	 */
	static get sellCost() {
		return this.#sellCost.toNum();
	}
	/**
	 * @param {number|Dollar} i
	 */
	static set sellCost(i) {
		this.#sellCost = i.$();
	}
	/**
	 * @returns {Resource[]}
	 * @param {number} am 
	 */
	static repeat(am) {
		let a = [];
		for (let i = 0; i < am; i++) {
			a.push(this);
		}
		return a;
	}
	static toPlainString() {
		return `${this.name}(${this.sellCost}$)`;
	}
	static toNoExpandString() {
		return `${chalk.hex(
			(this.name.indexOf('Aluminum') !== -1) ? '#bbbdbf' :
				(this.name.indexOf('Copper') !== -1) ? '#ff4500' :
					(this.name.indexOf('Diamond') !== -1) ? '#0dd3bb' :
						(this.name.indexOf('Gold') !== -1) ? '#ddbd37' :
							(this.name.indexOf('Iron') !== -1) ? '#646d73' : '#94e044'
		)(this.name.unCamel())}(${this.sellCost}$)`;
	}
	static toExpandString() {
		return `${chalk.hex(
			(this.name.indexOf('Aluminum') !== -1) ? '#bbbdbf' :
				(this.name.indexOf('Copper') !== -1) ? '#ff4500' :
					(this.name.indexOf('Diamond') !== -1) ? '#0dd3bb' :
						(this.name.indexOf('Gold') !== -1) ? '#ddbd37' :
							(this.name.indexOf('Iron') !== -1) ? '#646d73' : '#94e044'
		)(this.name.unCamel())} {\n  Sells at ${chalk.hex('#ffd635')(this.sellCost.toString() + '$')}\n  Is root: ${this.isRoot}\n}`
	}
	static toString(cLev = 1) {
		switch (cLev) {
			case 0:
				return this.toPlainString();
			case 1:
				return this.toNoExpandString();
			default:
				return this.toExpandString();
		}
	}
}

exports.Resource = Resource;

class None extends Resource {
	static isRoot = true;
}
exports.None = None;

const NONE = new None();
exports.NONE = NONE;

class Recipe {
	//#region
	/**
	 * @type {Resource}
	 */
	material1 = None;
	/**
	 * @type {number}
	 */
	amount1 = 0;
	/**
	 * @type {Resource}
	 */
	material2 = None;
	/**
	 * @type {number}
	 */
	amount2 = 0;
	/**
	 * @type {Resource}
	 */
	material3 = None;
	/**
	 * @type {number}
	 */
	amount3 = 0;
	//#endregion
	/**
	 * @param {Resource[]} what
	 */
	set ingredients(what) {
		const ings = [...new Set(what)];
		if (ings.length > 3) {
			throw new RangeError("Recipe must use a maximum of three seperate items.");
		}
		if (ings.length === 2) {
			ings[2] = None;
		} else if (ings.length === 1) {
			ings[1] = None;
			ings[2] = None;
		} else if (ings.length === 0) {
			ings[0] = None;
			ings[1] = None;
			ings[2] = None;
		}
		const list1 = what.filter(v => {
			return v === ings[0];
		});
		this.material1 = ings[0];
		this.amount1 = list1.length || 0;
		const list2 = what.filter(v => {
			return v === ings[1];
		});
		this.material2 = ings[1];
		this.amount2 = list2.length || 0;
		const list3 = what.filter(v => {
			return v === ings[2];
		});
		this.material3 = ings[2];
		this.amount3 = list3.length || 0;

	}
	/**
	 * @returns {Resource[]}
	 */
	get ingredients() {
		return [
			...this.material1.repeat(this.amount1),
			...this.material2.repeat(this.amount2),
			...this.material3.repeat(this.amount3)
		];
	}
	toNoColorString() {
		return `Recipe(${this.amount1} ${new this.material1()}, ${this.amount2} ${new this.material2()}, ${this.amount3} ${new this.material3()})`;
	}
	toColorString() {
		return `${chalk.hex('#ff66ac')('Recipe')} {\n  ${chalk.hex('#ffd635')(this.amount1)} ${chalk.hex('#94e044')(new this.material1().toString())}\n  ${chalk.hex('#ffd635')(this.amount2)} ${chalk.hex('#94e044')(new this.material2().toString())}\n  ${chalk.hex('#ffd635')(this.amount3)} ${chalk.hex('#94e044')(new this.material3().toString())}\n}`
	}
	toString(isC = true) {
		return isC ? this.toColorString() : this.toNoColorString();
	}
	/**
	 * @description Returns wheter the two recipes are equal (contain the same ingredients)
	 * @param {Recipe} other What to compare
	 * @returns {boolean}
	 */
	equal(other) {
		// let flag = true;
		if (this.amount1 !== other.amount1) return false;
		if (this.material1 !== other.material1) return false;
		if (this.amount2 !== other.amount2) return false;
		if (this.material2 !== other.material2) return false;
		if (this.amount3 !== other.amount3) return false;
		if (this.material3 !== other.material3) return false;
		return true;
	}
}
exports.Recipe = Recipe;

/**
 * @param {Resource[]} arr 
 */
function RecipeGen(arr = []) {
	let th = new Recipe()
	th.ingredients = arr;
	return th;
}

exports.RecipeGen = RecipeGen;

/**
 * @type {Recipe}
 */
Resource.recipe = RecipeGen();
None.recipe = RecipeGen([None]);

//#region 

class Aluminum extends Resource {
	static isRoot = true;
	static sellCost = 80;
}
exports.Aluminum = Aluminum;

class Copper extends Resource {
	static isRoot = true;
	static sellCost = 80;
}
exports.Copper = Copper;

class Diamond extends Resource {
	static isRoot = true;
	static sellCost = 80;
}
exports.Diamond = Diamond;

class Gold extends Resource {
	static isRoot = true;
	static sellCost = 80;
}
exports.Gold = Gold;

class Iron extends Resource {
	static isRoot = true;
	static sellCost = 80;
}
exports.Iron = Iron;

class AluminumGear extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Aluminum
	]);
}
exports.AluminumGear = AluminumGear;

class LiquidAluminum extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Aluminum
	]);
}
exports.LiquidAluminum = LiquidAluminum;

class AluminumWire extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Aluminum
	]);
}
exports.AluminumWire = AluminumWire;

class CopperGear extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Copper
	]);
}
exports.CopperGear = CopperGear;

class LiquidCopper extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Copper
	]);
}
exports.LiquidCopper = LiquidCopper;

class CopperWire extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Copper
	]);
}
exports.CopperWire = CopperWire;

class DiamondGear extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Diamond
	]);
}
exports.DiamondGear = DiamondGear;

class LiquidDiamond extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Diamond
	]);
}
exports.LiquidDiamond = LiquidDiamond;

class DiamondWire extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Diamond
	]);
}
exports.DiamondWire = DiamondWire;

class GoldGear extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Gold
	]);
}
exports.GoldGear = GoldGear;

class LiquidGold extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Gold
	]);
}
exports.LiquidGold = LiquidGold;

class GoldWire extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Gold
	]);
}
exports.GoldWire = GoldWire;

class IronGear extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Iron
	]);
}
exports.IronGear = IronGear;

class LiquidIron extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Iron
	]);
}
exports.LiquidIron = LiquidIron;

class IronWire extends Resource {
	static sellCost = 100;
	static recipe = RecipeGen([
		Iron
	]);
}
exports.IronWire = IronWire;

class AluminumPlate extends Resource {
	static sellCost = 250;
	static recipe = RecipeGen([
		Aluminum
	]);
}
exports.AluminumPlate = AluminumPlate;

class CopperPlate extends Resource {
	static sellCost = 250;
	static recipe = RecipeGen([
		Copper
	]);
}
exports.CopperPlate = CopperPlate;

class DiamondPlate extends Resource {
	static sellCost = 250;
	static recipe = RecipeGen([
		Diamond
	]);
}
exports.DiamondPlate = DiamondPlate;

class GoldPlate extends Resource {
	static sellCost = 250;
	static recipe = RecipeGen([
		Gold
	]);
}
exports.GoldPlate = GoldPlate;

class IronPlate extends Resource {
	static sellCost = 250;
	static recipe = RecipeGen([
		Iron
	]);
}
exports.IronPlate = IronPlate;

class Circuit extends Resource {
	static sellCost = 300;
	static recipe = RecipeGen([
		CopperWire,
		CopperWire,
		Gold
	]);
}
exports.Circuit = Circuit;

class Engine extends Resource {
	static sellCost = 360;
	static recipe = RecipeGen([
		IronGear,
		IronGear,
		GoldGear
	]);
}
exports.Engine = Engine;

class HeaterPlate extends Resource {
	static sellCost = 360;
	static recipe = RecipeGen([
		Diamond,
		Copper,
		CopperWire
	]);
}
exports.HeaterPlate = HeaterPlate;

class CoolerPlate extends Resource {
	static sellCost = 360;
	static recipe = RecipeGen([
		Diamond,
		Gold,
		GoldWire
	]);
}
exports.CoolerPlate = CoolerPlate;

class LightBulb extends Resource {
	static sellCost = 360;
	static recipe = RecipeGen([
		Iron,
		Iron,
		CopperWire,
		CopperWire
	]);
}
exports.LightBulb = LightBulb;

class Clock extends Resource {
	static sellCost = 540;
	static recipe = RecipeGen([
		Iron,
		Iron,
		Gold,
		Gold,
		CopperGear
	]);
}
exports.Clock = Clock;

class Antenna extends Resource {
	static sellCost = 540;
	static recipe = RecipeGen([
		DiamondWire,
		DiamondWire,
		DiamondWire,
		DiamondWire,
		Iron
	]);
}
exports.Antenna = Antenna;

class Grill extends Resource {
	static sellCost = 600;
	static recipe = RecipeGen([
		HeaterPlate,
		Iron,
		Iron,
		Iron,
		Iron
	]);
}
exports.Grill = Grill;

class Toaster extends Resource {
	static sellCost = 900;
	static recipe = RecipeGen([
		HeaterPlate,
		Aluminum,
		Copper
	]);
}
exports.Toaster = Toaster;

class AirConditioner extends Resource {
	static sellCost = 900;
	static recipe = RecipeGen([
		CoolerPlate,
		Gold,
		Aluminum
	]);
}
exports.AirConditioner = AirConditioner;

class Battery extends Resource {
	static sellCost = 1050;
	static recipe = RecipeGen([
		Aluminum,
		LiquidAluminum,
		Circuit
	]);
}
exports.Battery = Battery;

class WashingMachine extends Resource {
	static sellCost = 1100;
	static recipe = RecipeGen([
		Engine,
		Aluminum,
		Aluminum,
		Copper,
		Copper
	]);
}
exports.WashingMachine = WashingMachine;

class SolarPanel extends Resource {
	static sellCost = 1170;
	static recipe = RecipeGen([
		Circuit,
		Gold,
		Gold,
		Diamond
	]);
}
exports.SolarPanel = SolarPanel;

class Headphones extends Resource {
	static sellCost = 1300;
	static recipe = RecipeGen([
		Circuit,
		GoldWire,
		DiamondWire
	]);
}
exports.Headphones = Headphones;

class Processor extends Resource {
	static sellCost = 1320;
	static recipe = RecipeGen([
		Circuit,
		Circuit,
		Aluminum,
		Aluminum
	]);
}
exports.Processor = Processor;

class Drill extends Resource {
	static sellCost = 1500;
	static recipe = RecipeGen([
		Diamond,
		Diamond,
		CopperGear,
		CopperGear,
		Engine
	]);
}
exports.Drill = Drill;

class PowerSupply extends Resource {
	static sellCost = 1920;
	static recipe = RecipeGen([
		Circuit,
		CopperWire,
		CopperWire,
		CopperWire,
		IronWire,
		IronWire,
		IronWire
	]);
}
exports.PowerSupply = PowerSupply;

class Speakers extends Resource {
	static sellCost = 3300;
	static recipe = RecipeGen([
		Circuit,
		Circuit,
		GoldWire,
		GoldWire,
		GoldWire,
		GoldWire,
		DiamondWire,
		DiamondWire,
		DiamondWire,
		DiamondWire
	]);
}
exports.Speakers = Speakers;

class Radio extends Resource {
	static sellCost = 5670;
	static recipe = RecipeGen([
		Circuit,
		Antenna
	]);
}
exports.Radio = Radio;

class Jackhammer extends Resource {
	static sellCost = 6920;
	static recipe = RecipeGen([
		...Circuit.repeat(4),
		...Diamond.repeat(4),
		...IronPlate.repeat(4)
	]);
}
exports.Jackhammer = Jackhammer;

class TV extends Resource {
	static sellCost = 7100;
	static recipe = RecipeGen([
		PowerSupply,
		Circuit
	]);
}
exports.TV = TV;

class Smartphone extends Resource {
	static sellCost = 7300;
	static recipe = RecipeGen([
		Processor,
		Battery,
		Aluminum
	]);
}
exports.Smartphone = Smartphone;

class Fridge extends Resource {
	static sellCost = 7400;
	static recipe = RecipeGen([
		CoolerPlate,
		PowerSupply,
		...Aluminum.repeat(6)
	]);
}
exports.Fridge = Fridge;

class Tablet extends Resource {
	static sellCost = 7600;
	static recipe = RecipeGen([
		Processor,
		Battery,
		...Aluminum.repeat(4)
	]);
}
exports.Tablet = Tablet;

class Microwave extends Resource {
	static sellCost = 8070;
	static recipe = RecipeGen([
		HeaterPlate,
		...DiamondPlate.repeat(5),
		...AluminumPlate.repeat(5)
	]);
}
exports.Microwave = Microwave;

class Railway extends Resource {
	static sellCost = 8400;
	static recipe = RecipeGen([
		...Iron.repeat(10),
		...IronPlate.repeat(10)
	]);
}
exports.Railway = Railway;

class Smartwatch extends Resource {
	static sellCost = 10170;
	static recipe = RecipeGen([
		Processor,
		Processor,
		IronPlate,
		AluminumPlate,
		AluminumPlate
	]);
}
exports.Smartwatch = Smartwatch;

class ServerRack extends Resource {
	static sellCost = 10600;
	static recipe = RecipeGen([
		...AluminumPlate.repeat(20),
		...Aluminum.repeat(10)
	]);
}
exports.ServerRack = ServerRack;

class Computer extends Resource {
	static sellCost = 11000;
	static recipe = RecipeGen([
		Processor,
		PowerSupply,
		...Aluminum.repeat(6)
	]);
}
exports.Computer = Computer;

class Generator extends Resource {
	static sellCost = 11820;
	static recipe = RecipeGen([
		...Engine.repeat(4),
		...CopperPlate.repeat(5),
		...GoldPlate.repeat(5)
	]);
}
exports.Generator = Generator;

class WaterHeater extends Resource {
	static sellCost = 12900;
	static recipe = RecipeGen([
		...HeaterPlate.repeat(5),
		...DiamondPlate.repeat(5),
		...AluminumPlate.repeat(5)
	]);
}
exports.WaterHeater = WaterHeater;

class Drone extends Resource {
	static sellCost = 17220;
	static recipe = RecipeGen([
		Battery,
		Battery,
		Processor,
		Processor,
		...AluminumPlate.repeat(4)
	])
}
exports.Drone = Drone;

class ElectricBoard extends Resource {
	static sellCost = 27000;
	static recipe = RecipeGen([
		...Circuit.repeat(20),
		...CopperPlate.repeat(6),
		...IronPlate.repeat(6)
	]);
}
exports.ElectricBoard = ElectricBoard;

class Oven extends Resource {
	static sellCost = 27300;
	static recipe = RecipeGen([
		...HeaterPlate.repeat(10),
		...IronPlate.repeat(10),
		...Iron.repeat(10)
	]);
}
exports.Oven = Oven;

class Lazer extends Resource {
	static sellCost = 31800;
	static recipe = RecipeGen([
		...Battery.repeat(6),
		...DiamondPlate.repeat(10),
		...Circuit.repeat(6)
	]);
}
exports.Lazer = Lazer;

class AdvancedEngine extends Resource {
	static sellCost = 70000;
	static recipe = RecipeGen([
		...Engine.repeat(50),
		...Circuit.repeat(50)
	]);
}
exports.AdvancedEngine = AdvancedEngine;

class ElectricGenerator extends Resource {
	static sellCost = 470000;
	static recipe = RecipeGen([
		...Generator.repeat(15),
		...Circuit.repeat(50),
		...Battery.repeat(40)
	]);
}
exports.ElectricGenerator = ElectricGenerator;

class SuperComputer extends Resource {
	static sellCost = 550000;
	static recipe = RecipeGen([
		...Computer.repeat(30),
		...ServerRack.repeat(10)
	]);
}
exports.SuperComputer = SuperComputer;

class ElectricEngine extends Resource {
	static sellCost = 900000;
	static recipe = RecipeGen([
		...Battery.repeat(40),
		...AdvancedEngine.repeat(10)
	]);
}
exports.ElectricEngine = ElectricEngine;

class AIProcessor extends Resource {
	static sellCost = 2500000;
	static recipe = RecipeGen([
		...SuperComputer.repeat(4),
		...Circuit.repeat(40)
	]);
}
exports.AIProcessor = AIProcessor;

class AIRobotBody extends Resource {
	static sellCost = 2800000;
	static recipe = RecipeGen([
		...Aluminum.repeat(400),
		ElectricEngine,
		ElectricGenerator
	]);
}
exports.AIRobotBody = AIRobotBody;

class AIRobotHead extends Resource {
	static sellCost = 5000000;
	static recipe = RecipeGen([
		AIProcessor,
		...Aluminum.repeat(200)
	]);
}
exports.AIRobotHead = AIRobotHead;

class AIRobot extends Resource {
	static sellCost = 15000000;
	static recipe = RecipeGen([
		AIRobotHead,
		AIRobotBody
	]);
}
exports.AIRobot = AIRobot;

//#endregion