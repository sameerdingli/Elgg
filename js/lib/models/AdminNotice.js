elgg.provide('elgg.models.AdminNotice');

elgg.require('elgg.models.Object');


elgg.models.AdminNotice = function(object) {
	this.super_(object);
};
elgg.inherit(elgg.models.AdminNotice, elgg.models.Object);