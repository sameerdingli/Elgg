ArrayTest = TestCase('ArrayTest');

ArrayTest.prototype.testMap = function() {
	var arr = [1, 2, 3];
	var mapped = arr.map(function(val) {
		return val;
	});
	
	assertEquals(arr, mapped);
	assertNotSame(arr, mapped);
};

ArrayTest.prototype.testForEach = function() {
	[0, 1, 2].forEach(function(val, i) {
		assertEquals(val, i);
	});
};

ArrayTest.prototype.testEvery = function() {
	assertTrue([true, true, true].every(function(val) {
		return val;
	}));
	
	assertFalse([true, false, true].every(function(val) {
		return val;
	}));
};
