define('elgg/string', ['elgg'], function(elgg) {
	/**
	 * Instead of overriding the native String prototype, provide
	 * some "static" helper functions.
	 */
	var string = elgg.provide('elgg.string');
	
	/**
	 * Removes whitespace from the left side of a string.
	 * 
	 * @param {String} str The string to trim
	 * 
	 * @return {String} The new string with left whitespace removed.
	 */
	string.ltrim = function(str) {
		return str.replace(/^\s+/, "");
	};
	
	string.rtrim = function(str) {
		return str.replace(/\s+$/, "");
	};
	
	string.trim = function(str) {
		return string.ltrim(string.rtrim(str));
	};
	
	return string;
});