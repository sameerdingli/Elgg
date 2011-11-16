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
 * @param {function(*, number)} callback The 
 * @return {boolean}
 */
elgg.array.every = function(arr, callback) {
	var len = this.length, i;

	for (i = 0; i < len; i++) {
		if (i in arr && !callback.call(null, arr[i], i)) {
			return false;
		}
	}

	return true;
};


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
 * @param {{length: number}} arr            The array-like object to iterate over
 * @param {function(*, number)} callback    The callback to execute on each element
 */
elgg.array.forEach = function(arr, callback) {
	var len = arr.length, i;

	for (i = 0; i < len; i++) {
		if (i in arr) {
			callback.call(null, arr[i], i);
		}
	}
};
