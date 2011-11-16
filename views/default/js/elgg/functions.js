/**
 * Some convenience functions so we don't have to implement
 * inane functions over and over, wasting memory and time.
 * 
 * Most useful during testing, I suspect.
 */
define('elgg/functions', ['elgg'], function(elgg) {
	elgg.provide('elgg.functions');
	
	
	/**
	 * 
	 * @param val
	 * @returns {Function}
	 */
	elgg.functions.constant = function(val) {
		return function() {
			return val;
		};
	};
	
	
	/**
	 * Return a function that always throws an error with the given message.
	 * @param msg
	 * @returns {Function}
	 */
	elgg.functions.error = function(msg) {
		return function() {
			throw new Error(msg);
		};
	};
	
	
	/**
	 * Noop.
	 */
	elgg.functions.NULL = elgg.functions.constant(null);
	
	
	/**
	 * Always returns true.
	 */
	elgg.functions.TRUE = elgg.functions.constant(true);
	
	
	/**
	 * Always returns false.
	 */
	elgg.functions.FALSE = elgg.functions.constant(false);
	
	
	/**
	 * Always returns whatever you pass in.
	 */
	elgg.functions.IDENTITY = function(value) { return value; };
	
	
	/**
	 * Always throws an error (no message).
	 */
	elgg.functions.ERROR = elgg.functions.error();
	
	
	/**
	 * Use this for abstract methods that subclasses should implement.
	 */
	elgg.functions.ABSTRACT = elgg.functions.error("Unimplemented method");
	
	
	return elgg.functions;
});