/**
 * Represents a Uri.
 * 
 * Converts shorthand uris to absolute uris. Also parses the uri into its component
 * parts so they can be queried/set individually.
 *
 * For convenience, the "base" of all new uris is the url ("wwwroot") of the Elgg site.
 * 
 * If the url is already absolute or protocol-relative, the base is determined by the given uri.
 * 
 * @example
 * <pre>
 * <code>
 *     new Uri();                     // 'http://my.site.com/elgg/'
 *     new Uri('dashboard');          // 'http://my.site.com/elgg/dashboard'
 *     new Uri('/dashboard');         // 'http://my.site.com/elgg/dashboard'
 *     new Uri('http://google.com/'); // Absolute url. No change.
 *     new Uri('//google.com/');      // Protocol-relative url. No change.
 * </code>
 * </pre>
 */
define('elgg/Uri', function(require) {
	var elgg = require('elgg');
	

	
	var Uri = function(uri) {};
	
	
	/**
	 * The base that is assumed in the static functions
	 */
	Uri.base = '/';
	
	
	/**
	 * Save a little CPU by only generating these regexes one time...
	 * jslint complains if you use /regexp/ shorthand here... ?!?!
	 * We can leave it to the minifiers I guess...
	 * 
	 * @enum {RegExp}
	 */
	Uri.Regexes = {
		/**
		 * 'http://', 'https://', 'javascript:', '//google.com', 'mailto:'
		 */
		PROTOCOL: new RegExp("^(https?:)?//|(javascript|mailto):", "i"),
		
		PROTOCOL_RELATIVE: new RegExp(),
		
		QUERY_STRING_RELATIVE: new RegExp(),

		/**
		 * Some schemes don't need hosts
		 */
		NON_HOST_SCHEME: new RegExp("(mailto|news|file|javascript)", "i"),
		
		HOSTNAME: new RegExp("^[A-Z0-9\\-]+(\\.[A-Z0-9\\-]+)*$", "i"),
		
		/**
		 * 'install.php', 'install.php?step=step'
		 * 
		 * Watch those double escapes in JS.
		 */
		TOP_LEVEL_PHP_FILE: new RegExp("^[^/]*\\.php(\\?.*)?$", "i"),
		
		/**
		 * 'example.com', 'example.com/subpage'
		 */
		DOMAIN_WITHOUT_PROTOCOL: new RegExp("^[^/]*\\.", "i"),
		
		LEADING_SLASH: new RegExp("^/")
	};
	

	/**
	 * Converts shorthand urls to absolute urls.
	 *
	 * If the url is already absolute or protocol-relative, no change is made.
	 *
	 * Uri.normalize('');                   // 'http://my.site.com/'
	 * Uri.normalize('dashboard');          // 'http://my.site.com/dashboard'
	 * Uri.normalize('http://google.com/'); // no change
	 * Uri.normalize('//google.com/');      // no change
	 *
	 * @param {String} url The url to normalize
	 * @return {String} The extended url
	 * @private
	 */
	Uri.normalize = function(url) {
		url = url || '';

		// all normal URLs including mailto:
		validated = (function(url) {
			// '//example.com' (Shortcut for protocol.)
			// '?query=test', #target
			if ((new RegExp("^(\\#|\\?|//)", "i")).test(url)) {
				return true;
			}
			
			url = elgg.parse_url(url);
			if (url.scheme){
				url.scheme = url.scheme.toLowerCase();
			}
			if (url.scheme == 'http' || url.scheme == 'https') {
				if (!url.host) {
					return false;
				}
				/* hostname labels may contain only alphanumeric characters, dots and hypens. */
				if (!Uri.Regexes.HOSTNAME.test(url.host) || url.host.charAt(-1) == '.') {
					return false;
				}
			}

			/* some schemas allow the host to be empty */
			return url.scheme && (url.host || Uri.Regexes.NON_HOST_SCHEME.test(url.scheme));
		})(url);

		if (validated) {		
			return url;
		} else if (Uri.Regexes.TOP_LEVEL_PHP_FILE.test(url)) {
			return Uri.base + url.replace(Uri.Regexes.LEADING_SLASH, '');
		} else if (Uri.Regexes.DOMAIN_WITHOUT_PROTOCOL.test(url)) {
			return 'http://' + url;
		} else {
			// 'page/handler', '/mod/plugin/file.php', etc...
			// trim off any leading / because the site URL is stored
			// with a trailing /
			return Uri.base + url.replace(Uri.Regexes.LEADING_SLASH, '');
		}
	};
	
	
	/**
	 * Parse a URL into its parts. Mimicks http://php.net/parse_url
	 *
	 * @param {String}  url       The URL to parse
	 * @param {number}  component A component to return
	 * @param {boolean} expand    Expand the query into an object? Else it's a string.
	 *
	 * @return {Object} The parsed URL
	 */
	Uri.parse = function(url, component, expand) {
		// Adapted from http://blog.stevenlevithan.com/archives/parseuri
		// which was release under the MIT
		// It was modified to fix mailto: and javascript: support.
		var component = component || false;
		var expand = expand || false;
		
		// ?: means "do not create a back reference"
		var re_str =
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
			+ '(?:#(.*))?)';
		var keys = {
			'mailto': {
				4: "scheme",
				5: "user",
				6: "host",
				9: "path",
				12: "query",
				13: "fragment"
			},
			'standard': {
				1: "scheme",
				4: "user",
				5: "pass",
				6: "host",
				7: "port",
				9: "path",
				12: "query",
				13: "fragment"
			}
		};
		
		var results = {};
		var match_keys;
		var is_mailto = false;
		
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
			var path = '';
			var new_results = {};
			
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
	};
	
	
	/**
	 * Returns an object with key/values of the parsed query string.
	 *
	 * @param  {String} string The string to parse
	 * @return {Object} The parsed object string
	 */
	Uri.parseQuery = function(string) {
		var params = {};
		var result, key, value;
		var re = /([^&=]+)=?([^&]*)/g;
		
		while (result = re.exec(string)) {
			key = decodeURIComponent(result[1]);
			value = decodeURIComponent(result[2]);
			params[key] = value;
		}
		
		return params;
	};
	
	
	/**
	 * Returns a jQuery selector from a URL's fragment.  Defaults to expecting an ID.
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
	Uri.getSelectorFromHash = function(url) {
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
	Uri.forward = function(url) {
		location.href = Uri.normalize(url);
	};
	
	elgg.normalize_url = Uri.normalize;
	elgg.parse_url = Uri.parse;
	elgg.parse_str = Uri.parseQuery;
	elgg.getSelectorFromUrlFragment = Uri.getSelectorFromHash;
	elgg.forward = Uri.forward;
	
	return Uri;
});