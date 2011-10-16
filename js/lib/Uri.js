/**
 * Provides a Uri class.
 * 
 * Allows things like uri.addCsrfTokens();
 */
elgg.provide('elgg.Uri');

/**
 * Converts shorthand urls to absolute urls.
 *
 * If the url is already absolute or protocol-relative, no change is made.
 *
 * elgg.normalize_url('');                   // 'http://my.site.com/'
 * elgg.normalize_url('dashboard');          // 'http://my.site.com/dashboard'
 * elgg.normalize_url('http://google.com/'); // no change
 * elgg.normalize_url('//google.com/');      // no change
 *
 * @param {String} url The url to normalize
 * @return {String} The extended url
 * @private
 */
elgg.normalize_url = function(url) {
	url = url || '';
	elgg.assertTypeOf('string', url);

	// jslint complains if you use /regexp/ shorthand here... ?!?!
	if ((new RegExp("^(https?:)?//", "i")).test(url)) {
		return url;
	}

	// 'javascript:'
	else if (url.indexOf('javascript:') === 0) {
		return url;
	}

	// watch those double escapes in JS.

	// 'install.php', 'install.php?step=step'
	else if ((new RegExp("^[^\/]*\\.php(\\?.*)?$", "i")).test(url)) {
		return elgg.config.wwwroot + url.ltrim('/');
	}

	// 'example.com', 'example.com/subpage'
	else if ((new RegExp("^[^/]*\\.", "i")).test(url)) {
		return 'http://' + url;
	}

	// 'page/handler', 'mod/plugin/file.php'
	else {
		// trim off any leading / because the site URL is stored
		// with a trailing /
		return elgg.config.wwwroot + url.ltrim('/');
	}
};

/**
 * Parse a URL into its parts. Mimicks http://php.net/parse_url
 *
 * @param {String} url       The URL to parse
 * @param {Int}    component A component to return
 * @param {Bool}   expand Expand the query into an object? Else it's a string.
 *
 * @return {Object} The parsed URL
 */
elgg.parse_url = function(url, component, expand) {
	// Adapted from http://blog.stevenlevithan.com/archives/parseuri
	// which was release under the MIT
	// It was modified to fix mailto: and javascript: support.
	var
	expand = expand || false,
	component = component || false,
	
	re_str =
		// scheme (and user@ testing)
		'^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?://)?'
		// possibly a user[:password]@
		+ '((?:(([^:@]*)(?::([^:@]*))?)?@)?'
		// host and port
		+ '([^:/?#]*)(?::(\\d*))?)'
		// path
		+ '(((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[?#]|$)))*/?)?([^?#/]*))'
		// query string
		+ '(?:\\?([^#]*))?'
		// fragment
		+ '(?:#(.*))?)',
	keys = {
		'mailto':		{
			4: "scheme",
			5: "user",
			6: "host",
			9: "path",
			12: "query",
			13: "fragment"
		},

		'standard':		{
			1: "scheme",
			4: "user",
			5: "pass",
			6: "host",
			7: "port",
			9: "path",
			12: "query",
			13: "fragment"
		}
	},
	results = {},
	match_keys,
	is_mailto = false;

	var re = new RegExp(re_str);
	var matches = re.exec(url);

	// if the scheme field is undefined it means we're using a protocol
	// without :// and an @. Feel free to fix this in the re if you can >:O
	if (matches[1] == undefined) {
		match_keys = keys['mailto'];
		is_mailto = true;
	} else {
		match_keys = keys['standard'];
	}

	for (var i in match_keys) {
		if (matches[i]) {
			results[match_keys[i]] = matches[i];
		}
	}

	// merge everything to path if not standard
	if (is_mailto) {
		var path = '',
		new_results = {};

		if (typeof(results['user']) != 'undefined' && typeof(results['host']) != 'undefined') {
			path = results['user'] + '@' + results['host'];
			delete results['user'];
			delete results['host'];
		} else if (typeof(results['user'])) {
			path = results['user'];
			delete results['user'];
		} else if (typeof(results['host'])) {
			path = results['host'];
			delete results['host'];
		}

		if (typeof(results['path']) != 'undefined') {
			results['path'] = path + results['path'];
		} else {
			results['path'] = path;
		}

		for (var prop in results) {
			new_results[prop] = results[prop];
		}

		results = new_results;
	}

	if (expand && typeof(results['query']) != 'undefined') {
		results['query'] = elgg.parse_str(results['query']);
	}

	if (component) {
		if (typeof(results[component]) != 'undefined') {
			return results[component];
		} else {
			return false;
		}
	}
	return results;
}

/**
 * Returns an object with key/values of the parsed query string.
 *
 * @param  {String} string The string to parse
 * @return {Object} The parsed object string
 */
elgg.parse_str = function(string) {
	var params = {};
	var result,
		key,
		value,
		re = /([^&=]+)=?([^&]*)/g;

	while (result = re.exec(string)) {
		key = decodeURIComponent(result[1])
		value = decodeURIComponent(result[2])
		params[key] = value;
	}
	
	return params;
};

/**
 * Returns a jQuery selector from a URL's fragement.  Defaults to expecting an ID.
 *
 * Examples:
 *  http://elgg.org/download.php returns ''
 *	http://elgg.org/download.php#id returns #id
 *	http://elgg.org/download.php#.class-name return .class-name
 *	http://elgg.org/download.php#a.class-name return a.class-name
 *
 * @param {String} url The URL
 * @return {String} The selector
 */
elgg.getSelectorFromUrlFragment = function(url) {
	var fragment = url.split('#')[1];

	if (fragment) {
		// this is a .class or a tag.class
		if (fragment.indexOf('.') > -1) {
			return fragment;
		}

		// this is an id
		else {
			return '#' + fragment;
		}
	}
	return '';
};

/**
 * Meant to mimic the php forward() function by simply redirecting the
 * user to another page.
 *
 * @param {String} url The url to forward to
 */
elgg.forward = function(url) {
	location.href = elgg.normalize_url(url);
};