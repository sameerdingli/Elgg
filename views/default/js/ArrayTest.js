ArrayTest = TestCase('ArrayTest');

ArrayTest.prototype.testMap = function() {
	var arr = [1, 2, 3];
	var mapped = arr.map(function(val) {
		return val;
	});
	
	assertEquals(arr, mapped);
	assertNotSame(arr, mapped);
};
