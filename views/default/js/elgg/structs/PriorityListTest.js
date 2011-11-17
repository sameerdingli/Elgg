define('elgg/structs/PriorityListTest', [
    'elgg/functions',
    'elgg/structs/PriorityList'
], function(functions, PriorityList) {
	var Test = TestCase("elgg/structs/PriorityListTest");
	
	Test.prototype.setUp = function() {
		this.list = new PriorityList();
	};
	
	Test.prototype.tearDown = function() {
		this.list = null;
	};
	
	Test.prototype.testInsert = function() {
		this.list.insert('foo');
		
		assertEquals('foo', this.list.priorities_[500][0]);
		
		this.list.insert('bar', 501);
		
		assertEquals('bar', this.list.priorities_[501][0]);
	};
	
	Test.prototype.testInsertRespectsPriority = function() {
		var values = [6, 5, 4, 3, 2, 1];
		
		values.forEach(function(val) {
			this.list.insert(val, val);
		}, this);
		
		this.list.forEach(function(val, idx) {
			assertEquals(val - 1, idx);
		});
	};
	
	Test.prototype.testInsertHandlesDuplicatePriorities = function() {
		values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		
		values.forEach(function(val) {
			this.list.insert(val, val/2);
		}, this);
		
		this.list.forEach(function(val, idx) {
			assertEquals(val - 1, idx);
		});
	};
	
	Test.prototype.testEveryDefaultsToTrue = function() {
		assertTrue(this.list.every(functions.NULL));
	};
	
	return Test;
});