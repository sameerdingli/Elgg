/**
 * Instead of overriding the native String prototype, provide
 * some "static" helper functions.
 */
elgg.provide('elgg.string');

/**
 * Removes a character from the left side of a string.
 * 
 * @param {String} str The string to trim
 * @param {String} ch  The character to remove
 * 
 * @return {String}
 */
elgg.string.ltrim = function(str, ch) {
	if (str.ltrim) {
		return str.ltrim(ch);
	} else if (str.indexOf(ch) === 0) {
		return str.substring(ch.length);
	} else {
		return str;
	}
};
