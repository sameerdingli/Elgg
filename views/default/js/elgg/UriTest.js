elgg.UriTest = TestCase("elgg.UriTest");

elgg.UriTest.prototype.testNormalizeUrl = function() {
	elgg.config.wwwroot = "http://elgg.org/";

	[
	    ['', elgg.config.wwwroot],
	    ['test', elgg.config.wwwroot + 'test'],
	    ['http://google.com', 'http://google.com'],
	    ['//example.com', '//example.com'],
	    ['/page', elgg.config.wwwroot + 'page'],
	    ['mod/plugin/index.php', elgg.config.wwwroot + 'mod/plugin/index.php'],
	].forEach(function(args) {
		assertEquals(args[1], elgg.normalize_url(args[0]));
	});
};