elgg.provide('elgg.models.User');

elgg.require('elgg.models.Entity');




/**
 * Track a User
 *
 * @param {Object} o
 * @extends ElggEntity
 * @class Represents an ElggUser
 * @property {string} name
 * @property {string} username
 */
elgg.models.User = function(o) {
	this.super_(o);
};

elgg.inherit(elgg.models.User, elgg.models.Entity);