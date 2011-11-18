/**
 * Provides session-related methods.
 */
define('elgg/session', function(require) {
	var elgg = require('elgg');
	var ElggUser = require('elgg/models/User');
	
	var session = {};
	
	/**
	 * Helper function for setting cookies
	 * @param {String} name
	 * @param {String} value
	 * @param {Object} options
	 * 
	 *  {number|Date} options[expires]
	 * 	{String} options[path]
	 * 	{String} options[domain]
	 * 	{boolean} options[secure]
	 * 
	 * @return {String} The value of the cookie, if only name is specified
	 * TODO(ewinslow): Too many features in one function.
	 */
	session.cookie = function (name, value, options) {
		var cookies = [], cookie = [], i = 0, date, valid = true;
		
		//session.cookie()
		if (elgg.isUndefined(name)) {
			return document.cookie;
		}
		
		//session.cookie(name)
		if (elgg.isUndefined(value)) {
			if (document.cookie && document.cookie !== '') {
				cookies = document.cookie.split(';');
				for (i = 0; i < cookies.length; i += 1) {
					cookie = jQuery.trim(cookies[i]).split('=');
					if (cookie[0] === name) {
						return decodeURIComponent(cookie[1]);
					}
				}
			}
			return undefined;
		}
		
		// session.cookie(name, value[, opts])
		options = options || {};
		
		if (elgg.isNull(value)) {
			value = '';
			options.expires = -1;
		}
		
		cookies.push(name + '=' + value);
		
		if (elgg.isNumber(options.expires)) {
			date = new Date();
			if (elgg.isNumber(options.expires)) {
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else if (options.expires.toUTCString) {
				date = options.expires;
			} else {
				valid = false;
			}
			
			if (valid) {
				cookies.push('expires=' + date.toUTCString());
			}
		}
		
		// CAUTION: Needed to parenthesize options.path and options.domain
		// in the following expressions, otherwise they evaluate to undefined
		// in the packed version for some reason.
		if (options.path) {
			cookies.push('path=' + (options.path));
		}
		
		if (options.domain) {
			cookies.push('domain=' + (options.domain));
		}
		
		if (options.secure) {
			cookies.push('secure');
		}
		
		document.cookie = cookies.join('; ');
	};
	
	
	
	/**
	 * @return {elgg.models.User} The logged in user
	 */
	session.getUser = function() {
		return session.user;
	};
	
	
	
	
	/**
	 * @return {boolean} Whether the current user is logged in.
	 */
	session.isLoggedIn = function() {
		return (session.user instanceof ElggUser);
	};
	
	
	/**
	 * @return {boolean} Whether the logged in user is an admin
	 */
	session.isAdmin = function() {
		var user = session.user;
		return (user instanceof ElggUser) && user.isAdmin();
	};
	
	
	/**
	 * @return {number} The GUID of the logged in user.
	 */
	session.getUserGUID = function() {
		var user = session.user;
		return user ? user.guid : 0;
	};
	
	/**
	 * @deprecated Use elgg.session.getUserGUID() instead.
	 */
	elgg.get_logged_in_user_guid = session.getUserGUID;

	
	/**
	 * @deprecated Use elgg.session.isLoggedIn() instead.
	 */
	elgg.is_logged_in = session.isLoggedIn;
	
	
	/**
	 * @deprecated Use elgg.session.isAdmin() instead
	 */
	elgg.is_admin_logged_in = session.isAdminLoggedIn;
	
	
	/**
	 * @deprecated Use elgg.session.getUser() instead.
	 */
	elgg.get_logged_in_user_entity = session.getUser;
	
	
	/**
	 * @deprecated Use elgg.session.cookie instead
	 */
	jQuery.cookie = session.cookie;
	
	
	return elgg.session = session;
});