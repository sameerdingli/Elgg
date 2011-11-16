/**
 * This file as-is only works when the modules are loaded in dependency order
 * It's a simple shim so we can start coding modules in the AMD format
 */
var define, require;
(function() {
	var modules = {};
	
	/**
	 * @param {String}   name    The identifier for the module.
	 * @param {Array}    deps    The list of identifiers for the module's dependencies.
	 * @param {Function} factory The function to call that creates the module.
	 */
	define = function(name, dependencies, factory) {
		modules[name] = factory.apply(this, dependencies.map(require));
	};
	
	/**
	 * @param {String} name The identifier for the module.
	 * @return {*} The required module.
	 */
	require = function(name) {
		return modules[name];
	};
})();

this['define'] = define;
this['require'] = require;