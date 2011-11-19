/**
 * 
 */
define('elgg/models/AdminNotice', function(require) {
	var elgg = require('elgg');
	var ElggObject = require('elgg/models/Object');
	
	
	/**
	 * @constructor
	 * @extends {elgg.models.Object}
	 */
	var ElggAdminNotice = function(object) {
		this.super_(object);
	};
	elgg.inherit(ElggAdminNotice, ElggObject);
	
	
	return ElggAdminNotice;
});