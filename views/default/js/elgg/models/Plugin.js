elgg.provide('elgg.models.Plugin');

elgg.require('elgg.models.Object');

elgg.models.Plugin = function(object) {
	this.super_(object);
};
elgg.inherit(elgg.models.Plugin, elgg.models.Object);