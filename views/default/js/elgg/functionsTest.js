require(['elgg/functions'], function(functions) {
	var Test = TestCase('elgg/functionsTest');
	
	Test.prototype.testConstants = function() {
		assertTrue(functions.TRUE());
		assertFalse(functions.FALSE());
		assertEquals('foo', functions.IDENTITY('foo'));
		assertException(functions.ABSTRACT);
		assertException(functions.ERROR);
	};
	
	return Test;
});