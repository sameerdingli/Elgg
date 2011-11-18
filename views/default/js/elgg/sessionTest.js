require(function(require) {
	var session = require('elgg/session');
	
	
	
	var Test = TestCase("elgg/sessionTest");
	
	
	Test.prototype.testCanGetCookie = function() {
		assertEquals(document.cookie, session.cookie());
	};
	
	
	Test.prototype.testCanGetAndSetCookieKey = function() {
		session.cookie("name", "value");
		assertEquals('value', session.cookie('name'));
		
		session.cookie("name", "value");
		session.cookie("name", "value2");
		assertEquals('value2', session.cookie('name'));
		
		session.cookie("name", "value");
		session.cookie("name2", "value2");
		assertEquals('value', session.cookie('name'));
		assertEquals('value2', session.cookie('name2'));
		
		session.cookie('name', null);
		session.cookie('name2', null);
		assertUndefined(session.cookie('name'));
		assertUndefined(session.cookie('name2'));
	};
});