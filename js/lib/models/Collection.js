elgg.provide('elgg.models.Collection');

elgg.require('elgg.models.Entity');

/**
 * @param {number} object The GUID of the entity
 * @class
 * @extends elgg.models.Entity
 */
elgg.models.Collection = function(object) {
	this.super_(object);
};
elgg.inherit(elgg.models.Collection, elgg.models.Entity);