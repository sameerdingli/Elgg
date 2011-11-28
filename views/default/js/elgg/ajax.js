/**
 * Provides a bunch of useful shortcut functions for making ajax calls
 * @param {Function} require
 */
define('elgg/ajax', function(require) {
	var elgg = require('elgg');
	var Uri = require('elgg/Uri');
	
	
	var ajax = elgg.provide('ajax');
	
	/**
	 * Wrapper function for jQuery.ajax which ensures that the url being called
	 * is relative to the elgg site root.
	 *
	 * You would most likely use ajax.get or ajax.post, rather than this function
	 *
	 * @param {String} url Optionally specify the url as the first argument
	 * @param {Object} options {@see jQuery#ajax}
	 * @return {XmlHttpRequest}
	 */
	ajax.send = function(url, options) {
		options = ajax.handleOptions(url, options);
		
		options.url = Uri.normalize(options.url);
		return $.ajax(options);
	};
	
	
	/**
	 * @enum {number}
	 */
	ajax.Status = {
		SUCCESS: 0,
		ERROR: 1
	};
	
	/**
	 * Handle optional arguments and return the resulting options object
	 *
	 * @param url
	 * @param options
	 * @return {Object}
	 * @private
	 */
	ajax.handleOptions = function(url, options) {
		var data_only = true, data;
		
		//ajax('example/file.php', {...});
		if (elgg.isString(url)) {
			options = options || {};
			
		//ajax.send({...});
		} else {
			options = url || {};
			url = options.url;
		}
		
		//ajax.send('example/file.php', function() {...});
		if (elgg.isFunction(options)) {
			data_only = false;
			options = {success: options};
		}
		
		//ajax.send('example/file.php', {data:{...}});
		if (options.data) {
			data_only = false;
		} else {
			for (var member in options) {
				//ajax.send('example/file.php', {callback:function(){...}});
				if (elgg.isFunction(options[member])) {
					data_only = false;
				}
			}
		}
		
		//ajax.send('example/file.php', {notdata:notfunc});
		if (data_only) {
			data = options;
			options = {data: data};
		}
		
		if (url) {
			options.url = url;
		}
		
		return options;
	};
	
	/**
	 * Wrapper function for ajax which forces the request type to 'get.'
	 *
	 * @param {string} url Optionally specify the url as the first argument
	 * @param {Object} options {@see jQuery#ajax}
	 * @return {XmlHttpRequest}
	 */
	ajax.get = function(url, options) {
		options = ajax.handleOptions(url, options);
		options.type = 'get';
		return ajax.send(options);
	};
	
	/**
	 * Wrapper function for ajax.get which forces the dataType to 'json.'
	 *
	 * @param {string} url Optionally specify the url as the first argument
	 * @param {Object} options {@see jQuery#ajax}
	 * @return {XmlHttpRequest}
	 */
	ajax.getJSON = function(url, options) {
		options = ajax.handleOptions(url, options);
		
		options.dataType = 'json';
		return ajax.get(options);
	};
	
	/**
	 * Wrapper function for ajax.send which forces the request type to 'post.'
	 *
	 * @param {string} url Optionally specify the url as the first argument
	 * @param {Object} options {@see jQuery#ajax}
	 * @return {XmlHttpRequest}
	 */
	ajax.post = function(url, options) {
		options = ajax.handleOptions(url, options);
		options.type = 'post';
		return ajax.send(options);
	};
	
	/**
	 * Perform an action via ajax
	 *
	 * @example Usage 1:
	 * At its simplest, only the action name is required (and anything more than the
	 * action name will be invalid).
	 * <pre>
	 * ajax.action('name/of/action');
	 * </pre>
	 *
	 * The action can be relative to the current site ('name/of/action') or
	 * the full URL of the action ('http://elgg.org/action/name/of/action').
	 *
	 * @example Usage 2:
	 * If you want to pass some data along with it, use the second parameter
	 * <pre>
	 * ajax.action('friend/add', { friend: some_guid });
	 * </pre>
	 *
	 * @example Usage 3:
	 * Of course, you will have no control over what happens when the request
	 * completes if you do it like that, so there's also the most verbose method
	 * <pre>
	 * ajax.action('friend/add', {
	 *     data: {
	 *         friend: some_guid
	 *     },
	 *     success: function(json) {
	 *         //do something
	 *     },
	 * }
	 * </pre>
	 * You can pass any of your favorite $.ajax arguments into this second parameter.
	 *
	 * @note If you intend to use the second field in the "verbose" way, you must
	 * specify a callback method or the data parameter.  If you do not, ajax.action
	 * will think you mean to send the second parameter as data.
	 *
	 * @note You do not have to add security tokens to this request.  Elgg does that
	 * for you automatically.
	 *
	 * @see jQuery.ajax
	 *
	 * @param {String} action The action to call.
	 * @param {Object} options
	 * @return {XMLHttpRequest}
	 */
	ajax.action = function(action, options) {
		// support shortcut and full URLs
		// this will mangle URLs that aren't elgg actions.
		// Use post or get for those.
		if (action.indexOf('action/') == -1) {
			action = 'action/' + action;
		}
		
		options = ajax.handleOptions(action, options);
		
		options.data = elgg.extend(options.data, elgg.config.securityToken);
		options.dataType = 'json';
		
		//Always display system messages after actions
		var custom_success = options.success || elgg.nullFunction;
		options.success = function(json, two, three, four) {
			if (json && json.system_messages) {
				elgg.register_error(json.system_messages.error);
				elgg.system_message(json.system_messages.success);
			}
			
			custom_success(json, two, three, four);
		};
		
		return ajax.post(options);
	};
});