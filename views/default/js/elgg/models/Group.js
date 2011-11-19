/**
 * Data model for groups
 */
define('elgg/models/Group', function(require) {
	var elgg = require('elgg');
	var ElggEntity = require('elgg/models/Entity');
	
	
	
	/**
	 * @param {Object} object The GUID of the group
	 * @constructor
	 * @extends {elgg.models.Entity}
	 */
	var ElggGroup = function(object) {
		this.super_(object);
	};
	elgg.inherit(ElggGroup, ElggEntity);
	
	
	return ElggGroup;
});