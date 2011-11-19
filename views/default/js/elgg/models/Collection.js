/**
 * 
 */
define('elgg/models/Collection', function(require) {
	var elgg = require('elgg');
	var ElggObject = require('elgg/models/Object');
	
	
	
	/**
	 * @param {number} object The GUID of the entity
	 * @class
	 * @constructor
	 * @extends {elgg.models.Object}
	 */
	var ElggCollection = function(object) {
		this.super_(object);
	};
	elgg.inherit(ElggCollection, ElggObject);
	
	
	return ElggCollection;
});