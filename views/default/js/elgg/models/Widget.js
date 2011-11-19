/**
 * 
 */
define('elgg/models/Widget', function(require) {
	var elgg = require('elgg');
	var ElggObject = require('elgg/models/Object');
	
	
	
	/**
	 * @constructor
	 * @extends {elgg.models.Object}
	 */
	var ElggWidget = function(object) {
		this.super_(object);
	};
	elgg.inherit(ElggWidget, ElggObject);
	
	
	
	return ElggWidget;
});
