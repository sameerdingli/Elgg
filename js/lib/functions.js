/**
 * Some convenience functions so we don't have to implement
 * inane functions over and over, wasting memory and time.
 * 
 * Most useful during testing, I suspect.
 */
elgg.provide('elgg.functions');

/**
 * Noop 
 */
elgg.functions.NULL = function() {};

/**
 * Always throws an error
 */
elgg.functions.ERROR = function() {
	throw new Error(); 
};

/**
 * Always returns whatever you pass in
 */
elgg.functions.IDENTITY = function(value) {
	return value;
};

/**
 * Always returns true
 */
elgg.functions.TRUE = function() { 
	return true; 
};

/**
 * Always returns false
 */
elgg.functions.FALSE = function() {
	return false;
};
