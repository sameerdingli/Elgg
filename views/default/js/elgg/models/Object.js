elgg.provide('elgg.models.Object');

elgg.require('elgg.models.Entity');

elgg.models.Object = function(guid) {
	this.super_(guid);
};
elgg.inherit(elgg.models.Object, elgg.models.Entity);