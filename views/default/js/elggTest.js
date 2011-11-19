require(['elgg'], function(elgg) {
	var Test = TestCase("elggTest");

	Test.prototype.testGlobalIsWindow = function() {
		assertSame(window, elgg.global);
	};

	Test.prototype.testProvideDoesntClobber = function() {
		elgg.provide('foo.bar.baz');

		foo.bar.baz.oof = "test";

		elgg.provide('foo.bar.baz');

		assertEquals("test", foo.bar.baz.oof);
	};

	Test.prototype.testRequireThrowsExceptionOnMissingRequirement = function () {
		assertException(function(){ elgg.require(''); });
		assertException(function(){ elgg.require('garbage'); });
		assertException(function(){ elgg.require('gar.ba.ge'); });

		assertNoException(function(){
			elgg.require('elgg');
			elgg.require('Array');
			elgg.require('Array.prototype');
		});
	};

	Test.prototype.testInheritAffectsInstanceOf = function () {
		function Parent() {}
		function Child() {}

		elgg.inherit(Child, Parent);

		assertInstanceOf(Parent, new Child());
	};

	Test.prototype.testInheritSetsConstructor = function() {
		function Parent() {}
		function Child() {}

		elgg.inherit(Child, Parent);

		assertEquals(Child, Child.prototype.constructor);
	};

	Test.prototype.testInheritAllowsSuperConstructorAccess = function() {
		function Parent() { this.foo = 'bar'; }
		function Child() { this.super_(); }

		elgg.inherit(Child, Parent);
		
		assertEquals('bar', new Child().foo);
	};

	Test.prototype.testInheritAllowsSuperMethodAccess = function() {
		function Parent() {};
		Parent.prototype.foo = function() { return 'bar'; };
		
		function Child() { this.super_(); }
		elgg.inherit(Child, Parent);
		Child.prototype.foo = function() { return this.super_('foo'); };

		assertEquals('bar', new Child().foo());
	};
});
