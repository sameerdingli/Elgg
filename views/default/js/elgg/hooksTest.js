define('elgg/hooksTest', ['elgg/hooks'], function(hooks) {
	elgg.provide('elgg.config.hooks.all.all');
	
	Test = TestCase("elgg/hooksTest");
	
	Test.prototype.setUp = function() {
		elgg.config.hooks = {};
	};
	
	Test.prototype.testHookHandlersMustBeFunctions = function () {
		assertException(function() { elgg.register_hook_handler('str', 'str', 'oops'); });
	};
	
	Test.prototype.testReturnValueDefaultsToTrue = function () {
		assertTrue(elgg.trigger_hook('fee', 'fum'));
		
		elgg.register_hook_handler('fee', 'fum', elgg.nullFunction);
		assertTrue(elgg.trigger_hook('fee', 'fum'));
	};
	
	Test.prototype.testCanGlomHooksWithAll = function () {
		elgg.register_hook_handler('all', 'bar', elgg.abstractMethod);
		assertException("all,bar", function() { elgg.trigger_hook('foo', 'bar'); });
		
		elgg.register_hook_handler('foo', 'all', elgg.abstractMethod);
		assertException("foo,all", function() { elgg.trigger_hook('foo', 'baz'); });
		
		elgg.register_hook_handler('all', 'all', elgg.abstractMethod);
		assertException("all,all", function() { elgg.trigger_hook('pinky', 'winky'); });
	};

	return Test;
});