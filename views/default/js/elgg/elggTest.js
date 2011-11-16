/**
 * Test basic elgg library functions
 */
elgg.ElggTest = TestCase("elgg.ElggTest");

elgg.ElggTest.prototype.testGlobalIsWindow = function() {
	assertTrue(window === elgg.global);
};

elgg.ElggTest.prototype.testAssertTypeOf = function() {
	[//Valid inputs
	    ['string', ''],
        ['object', {}],
        ['boolean', true],
        ['boolean', false],
        ['undefined', undefined],
        ['number', 0],
        ['function', elgg.nullFunction]
    ].forEach(function(args) {
		assertNoException(function() {
			elgg.assertTypeOf.apply(undefined, args);
		});
	});

	[//Invalid inputs
        ['function', {}],
        ['object', elgg.nullFunction]
    ].forEach(function() {
		assertException(function(args) {
			elgg.assertTypeOf.apply(undefined, args);
		});
	});
};

elgg.ElggTest.prototype.testProvideDoesntClobber = function() {
	elgg.provide('foo.bar.baz');

	foo.bar.baz.oof = "test";

	elgg.provide('foo.bar.baz');

	assertEquals("test", foo.bar.baz.oof);
};

/**
 * Try requiring bogus input
 */
elgg.ElggTest.prototype.testRequireThrowsExceptionOnMissingRequirement = function () {
	assertException(function(){ elgg.require(''); });
	assertException(function(){ elgg.require('garbage'); });
	assertException(function(){ elgg.require('gar.ba.ge'); });

	assertNoException(function(){
		elgg.require('jQuery');
		elgg.require('elgg');
		elgg.require('elgg.config');
		elgg.require('elgg.security');
	});
};

elgg.ElggTest.prototype.testInheritAffectsInstanceOf = function () {
	function Parent() {}
	function Child() {}

	elgg.inherit(Child, Parent);

	assertInstanceOf(Parent, new Child());
};

elgg.ElggTest.prototype.testInheritSetsConstructor = function() {
	function Parent() {}
	function Child() {}

	elgg.inherit(Child, Parent);

	assertEquals(Child, Child.prototype.constructor);
};

elgg.ElggTest.prototype.testInheritAllowsSuperConstructorAccess = function() {
	function Parent() { this.foo = 'bar'; }
	function Child() { this.super_(); }

	elgg.inherit(Child, Parent);
	
	assertEquals('bar', new Child().foo);
};

elgg.ElggTest.prototype.testInheritAllowsSuperMethodAccess = function() {
	function Parent() {};
	Parent.prototype.foo = function() { return 'bar'; };
	
	function Child() { this.super_(); }
	elgg.inherit(Child, Parent);
	Child.prototype.foo = function() { return this.super_('foo'); };

	assertEquals('bar', new Child().foo());
};