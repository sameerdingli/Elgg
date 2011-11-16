/**
 * Makes sure that each of the helper ajax functions ends up calling $.ajax
 * with the right options.
 */
elgg.AjaxTest = TestCase("elgg.AjaxTest");

elgg.AjaxTest.prototype.setUp = function() {
	
	this.wwwroot = elgg.config.wwwroot;
	this.ajax = $.ajax;
	
	elgg.config.wwwroot = 'http://www.elgg.org/';
	
	$.ajax = function(options) {
		return options;
	};
};

elgg.AjaxTest.prototype.tearDown = function() {
	$.ajax = this.ajax;
	elgg.config.wwwroot = this.wwwroot;
};

elgg.AjaxTest.prototype.testAjax = function() {
	assertEquals(elgg.config.wwwroot, elgg.ajax.send().url);
};

elgg.AjaxTest.prototype.testGet = function() {
	assertEquals('get', elgg.ajax.get().type);
};

elgg.AjaxTest.prototype.testGetJSON = function() {
	assertEquals('json', elgg.ajax.getJSON().dataType);
};

elgg.AjaxTest.prototype.testPost = function() {
	assertEquals('post', elgg.ajax.post().type);
};

elgg.AjaxTest.prototype.testAction = function() {
	assertException(function() { elgg.ajax.action(); });
	assertException(function() { elgg.ajax.action({}); });
	
	var result = elgg.ajax.action('action');
	assertEquals('post', result.type);
	assertEquals('json', result.dataType);
	assertEquals(elgg.config.wwwroot + 'action/action', result.url);
	assertEquals(elgg.security.token.__elgg_ts, result.data.__elgg_ts);
};
