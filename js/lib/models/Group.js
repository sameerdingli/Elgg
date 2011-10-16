/**
 * Data model for groups
 */
elgg.provide('elgg.models.Group');

elgg.require('elgg.models.Collection');



/**
 * 
 * @param {Object} object The GUID of the group
 */
elgg.models.Group = function(object) {
	this.super_(object);
};
elgg.inherit(elgg.models.Group, elgg.models.Collection);