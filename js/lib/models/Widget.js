/**
 * 
 */
elgg.provide('elgg.models.Widget');

elgg.require('elgg.models.Object');


/**
 * 
 */
elgg.models.Widget = function(object) {
	this.super_(object);
};
elgg.inherit(elgg.models.Widget, elgg.models.Object);