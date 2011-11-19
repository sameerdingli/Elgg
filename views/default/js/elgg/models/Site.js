/**
 * 
 */
define('elgg/models/Site', function(require) {
	var elgg = require('elgg');
	var ElggEntity = require('elgg/models/Entity');
	
	
	
	/**
	 * @constructor
	 * @extends {elgg.models.Entity}
	 */
	var ElggSite = function(guid) {
		this.super_(guid);
	};
	elgg.inherit(ElggSite, ElggEntity);
	
	
	
	return ElggSite;
});
