elgg.provide('elgg.models.Site');

elgg.require('elgg.models.Entity');

elgg.models.Site = function(guid) {
	this.super_(guid);
};
elgg.inherit(elgg.models.Site, elgg.models.Entity);