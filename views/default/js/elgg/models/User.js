/**
 * 
 */
define('elgg/models/User', function(require) {
	var elgg = require('elgg');
	var ElggEntity = require('elgg/models/Entity');
	

	
	/**
	 * Represents an ElggUser
	 *
	 * @constructor
	 * @extends {elgg.models.Entity}
	 */
	var ElggUser = function(o) {
		this.super_(o);
	};
	elgg.inherit(ElggUser, ElggEntity);
	
	
	/**
	 * @return {boolean} Whether this user is an admin.
	 */
	ElggUser.prototype.isAdmin = function() {
		return !!this.admin;
	};
	
	
	
	return ElggUser;
});


