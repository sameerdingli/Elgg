/**
 * Instead of overriding the native String prototype, provide
 * some helper functions.
 */
define('elgg/string', function() {
	var string = {};
	
	
	/**
	 * Removes whitespace from the beginning of a string.
	 * 
	 * @param {String} str The string to trim
	 * 
	 * @return {String} The new string with left whitespace removed.
	 */
	string.ltrim = function(str) {
		return str.replace(/^\s+/, "");
	};
	
	
	/**
	 * Removes whitespace from the end of a string.
	 * 
	 * @param {String} str
	 * 
	 * @return {String}
	 */
	string.rtrim = function(str) {
		return str.replace(/\s+$/, "");
	};
	
	
	/**
	 * Removes whitespace from both sides of a string.
	 * 
	 * @param {String} str
	 * 
	 * @return {String}
	 */
	string.trim = function(str) {
		return string.ltrim(string.rtrim(str));
	};
	
	
	return string;
});