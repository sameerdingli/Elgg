/**
 * This file should contain asserts, logging, etc. The stuff that should
 * only be in the code during testing/development.
 */
elgg.provide('elgg.debug');

/**
 * Throw an exception of the type doesn't match
 *
 * @todo Might be more appropriate for debug mode only?
 */
elgg.debug.assertTypeOf = function(type, val) {
	if (typeof val !== type) {
		throw new TypeError("Expecting param of " +
							arguments.caller + "to be a(n) " + type + "." +
							"  Was actually a(n) " + typeof val + ".");
	}
};