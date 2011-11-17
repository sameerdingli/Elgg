define('elgg/models/User', [
    'elgg',
    'elgg/models/Entity',
], function(elgg, Entity) {
	elgg.provide('elgg.models.User');
	
	/**
	 * Represents an ElggUser
	 *
	 * @param {Object} o
	 * @property {string} name
	 * @property {string} username
	 * @constructor
	 * @extends {elgg.models.Entity}
	 */
	elgg.models.User = function(o) {
		this.super_(o);
	};
	elgg.inherit(elgg.models.User, Entity);
	
	
	/**
	 * @return {boolean} Whether this user is an admin.
	 */
	elgg.models.User.prototype.isAdmin = function() {
		return !!this.admin;
	};
	
	return elgg.models.User;
});


