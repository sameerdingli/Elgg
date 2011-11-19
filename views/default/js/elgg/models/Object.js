/**
 * Data model for objects
 */
define('elgg/models/Object', function(require) {
	var elgg = require('elgg');
	var ElggEntity = require('elgg/models/Entity');
	
	
	
	/**
	 * @constructor
	 * @extends {elgg.models.Entity}
	 */
	var ElggObject = function(guid) {
		this.super_(guid);
	};
	elgg.inherit(ElggObject, ElggEntity);
	
	
	return ElggObject;
});