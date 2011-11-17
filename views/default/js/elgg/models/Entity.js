define('elgg/models/Entity', ['elgg'], function(elgg) {
	elgg.provide('elgg.models.Entity');

	/**
	 * Create a new ElggEntity
	 * 
	 * @param {Object} object The properties with which to initialize the entity
	 * 
	 * @class Represents an ElggEntity
	 * @property {number} guid
	 * @property {string} type
	 * @property {string} subtype
	 * @property {number} owner_guid
	 * @property {number} site_guid
	 * @property {number} container_guid
	 * @property {number} access_id
	 * @property {number} time_created
	 * @property {number} time_updated
	 * @property {number} last_action
	 * @property {string} enabled
	 * @constructor
	 */
	elgg.models.Entity = function(object) {
		elgg.extend(this, object);
	};
	
	return elgg.models.Entity;
});