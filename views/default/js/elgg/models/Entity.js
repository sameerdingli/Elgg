define('elgg/models/Entity', function(require) {
	var elgg = require('elgg');
	
	
	
	/**
	 * Represents a new ElggEntity
	 * 
	 * @param {Object} object The properties with which to initialize the entity.
	 * 
	 * @constructor
	 */
	var ElggEntity = function(object) {
		elgg.extend(this, object);
	};
	
	
	return ElggEntity;
});