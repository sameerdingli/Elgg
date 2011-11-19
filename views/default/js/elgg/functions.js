/**
 * Some convenience functions so we don't have to implement
 * inane functions over and over, wasting memory and time.
 * 
 * Most useful during testing, I suspect.
 */
define('elgg/functions', ['elgg'], function(elgg) {
	var functions = elgg.provide('elgg.functions');
	
	
	/**
	 * 
	 * @param val
	 * @returns {Function}
	 */
	functions.constant = function(val) {
		return function() {
			return val;
		};
	};
	
	
	/**
	 * Return a function that always throws an error with the given message.
	 * @param msg
	 * @returns {Function}
	 */
	functions.error = function(msg) {
		return function() {
			throw new Error(msg);
		};
	};
	
	
	/**
	 * Noop.
	 */
	functions.NULL = functions.constant(null);
	
	
	/**
	 * Always returns true.
	 */
	functions.TRUE = functions.constant(true);
	
	
	/**
	 * Always returns false.
	 */
	functions.FALSE = functions.constant(false);
	
	
	/**
	 * Always returns whatever you pass in.
	 */
	functions.IDENTITY = function(value) { return value; };
	
	
	/**
	 * Always throws an error (no message).
	 */
	functions.ERROR = functions.error();
	
	
	/**
	 * Use this for abstract methods that subclasses should implement.
	 */
	functions.ABSTRACT = functions.error("Unimplemented method");
	
	
	return functions;
});