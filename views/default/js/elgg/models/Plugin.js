/**
 * 
 */
define('elgg/models/Plugin', function(require) {
	var elgg = require('elgg');
	var ElggObject = require('elgg/models/Object');

	

	/**
	 * @constructor
	 * @extends {elgg.models.Object}
	 */
	var ElggPlugin = function(object) {
		this.super_(object);
	};
	elgg.inherit(ElggPlugin, ElggObject);
	
	
	
	return ElggPlugin;
});
