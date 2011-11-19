require(['elgg/string'], function(string) {
	var Test = TestCase('elgg/stringTest');
	
	Test.prototype.testRtrim = function() {
		assertEquals(" r", string.rtrim(" r "));
	};
	
	Test.prototype.testLtrim = function() {
		assertEquals("l ", string.ltrim(" l "));
	};
	
	Test.prototype.testTrim = function() {
		assertEquals("t", string.trim(" t "));
	};
});