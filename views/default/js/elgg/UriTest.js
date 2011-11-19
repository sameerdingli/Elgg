require(['elgg/Uri'], function(Uri) {
	
	Uri.base = 'http://elgg.org/';

	
	
	var Test = TestCase("elgg/UriTest");
	
	Test.prototype.testCanNormalizeEmptyString = function() {
		assertEquals(Uri.base, Uri.normalize(''));
	};
	
	Test.prototype.testCanNormalizeAbsoluteUrls = function() {
		[
			['http://example.com', 'http://example.com'],
			['https://example.com', 'https://example.com'],
			['http://example-time.com', 'http://example-time.com']
		].forEach(function(args) {
			var expected = args[1];
			var actual = Uri.normalize(args[0]);
			assertEquals(expected, actual);
		});
	};
	
	Test.prototype.testCanNormalizeRootRelativeUrls = function() {
		[
			['/test', Uri.base + 'test'],
			['/page/handler', Uri.base + 'page/handler'],
			['/page/handler?p=v&p2=v2', Uri.base + 'page/handler?p=v&p2=v2'],
			['/mod/plugin/file.php', Uri.base + 'mod/plugin/file.php'],
			['/mod/plugin/file.php?p=v&p2=v2', Uri.base + 'mod/plugin/file.php?p=v&p2=v2'],
			['/rootfile.php', Uri.base + 'rootfile.php'],
			['/rootfile.php?p=v&p2=v2', Uri.base + 'rootfile.php?p=v&p2=v2']
		].forEach(function(args) {
			var expected = args[1];
			var actual = Uri.normalize(args[0]);
			assertEquals(expected, actual);
		});
	};
	
	Test.prototype.testCanNormalizeRootRelativeUrlsWithoutLeadingSlash = function() {
		[
			['test', Uri.base + 'test'],
			['page/handler', Uri.base + 'page/handler'],
			['page/handler?p=v&p2=v2', Uri.base + 'page/handler?p=v&p2=v2'],
			['mod/plugin/file.php', Uri.base + 'mod/plugin/file.php'],
			['mod/plugin/file.php?p=v&p2=v2', Uri.base + 'mod/plugin/file.php?p=v&p2=v2'],
			['rootfile.php', Uri.base + 'rootfile.php'],
			['rootfile.php?p=v&p2=v2', Uri.base + 'rootfile.php?p=v&p2=v2']
		].forEach(function(args) {
			var expected = args[1];
			var actual = Uri.normalize(args[0]);
			assertEquals(expected, actual);
		});
	};
	
	Test.prototype.testCanNormalizeNonHttpProtocols = function() {
		[
			['ftp://example.com/file', 'ftp://example.com/file'],
			['mailto:brett@elgg.org', 'mailto:brett@elgg.org'],
			['javascript:alert("test")', 'javascript:alert("test")'],
			['app://endpoint', 'app://endpoint']
		].forEach(function(args) {
			var expected = args[1];
			var actual = Uri.normalize(args[0]);
			assertEquals(expected, actual);
		});
	};
	
	Test.prototype.testCanNormalizeProtocolRelativeUrls = function() {
		[
			['example.com', 'http://example.com'],
			['example.com/subpage', 'http://example.com/subpage'],
			['//example.com', '//example.com']
		].forEach(function(args) {
			var expected = args[1];
			var actual = Uri.normalize(args[0]);
			assertEquals(expected, actual);
		});
	};
});
