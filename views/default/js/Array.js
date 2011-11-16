/**
 * Some Array.prototype shims that we can hopefully get rid of over time as
 * we deprecate support for older browsers.
 */
if (!Array.prototype.every) {
	/**
	 * Interates through each element of an array and calls a callback function.
	 * The callback should accept the following arguments:
	 *	element - The current element
	 *	index	- The current index
	 *
	 * This is different from Array.forEach in that if the callback returns false, the loop returns
	 * immediately without processing the remaining elements.
	 * 
	 * Mnemonic: Does the callback return true for *every* element in this array?
	 * 
	 * Needed here for IE8 and under, possibly some mobile browsers.
	 * 
	 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
	 * @param {function(*, number):boolean} callback
	 * @return {boolean} Whether every element in this array passes the callback.
	 */
	Array.prototype.every = function(callback, thisObject) {
		var me = this;
		var length = me.length;
		
		for (var i = 0; i < length; i++) {
			if (i in me && !callback.call(thisObject, me[i], i)) {
				return false;
			}
		}
		
		return true;
	};
}

if (!Array.prototype.forEach) {
	/**
	 * Interates through each element of an array and calls a callback function.
	 * The callback should accept the following arguments:
	 *	element - The current element in the array
	 *	index	- The current index in the array
	 *
	 * This is different from elgg.array.every in that the callback's return value is ignored.
	 * 
	 * Mnemonic: Execute the callback *for each* element in this array
	 *
	 * Needed here for IE8 and under, possibly some mobile browsers.
	 * 
	 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	 * @param {function(*, number)} callback
	 */
	Array.prototype.forEach = function(callback, thisObject) {
		var me = this;
		var length = me.length;
		
		for (var i = 0; i < length; i++) {
			if (i in me) {
				callback.call(thisObject, me[i], i);
			}
		}
	};
}

if (!Array.prototype.map) {
	/**
	 * Apply transformations in callback to each element in the array.
	 * 
	 * Does not mutate the array it is called on.
	 * 
	 * Needed here for IE8 and under, possibly some mobile browsers.
	 * 
	 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
	 * @param {function(*, number)} callback
	 * @returns {Array} The new array with transformations applied.
	 */
	Array.prototype.map = function(callback, thisObject) {
		var me = this;
		var mapped = [];
		var length = me.length;
		
		for (var i = 0; i < length; i++) {
			if (i in me) {
				mapped[i] = callback.call(thisObject, me[i], i);
			}
		}

		return mapped;
	};
}
