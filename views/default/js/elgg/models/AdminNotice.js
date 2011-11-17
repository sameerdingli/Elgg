define('elgg/models/AdminNotice', [
	'elgg',
	'elgg/models/Object'
], function(elgg, ElggObject) {
	elgg.provide('elgg.models.AdminNotice');
	
	var AdminNotice = function(object) {
		this.super_(object);
	};
	elgg.inherit(AdminNotice, ElggObject);
	
	
	return elgg.models.AdminNotice = AdminNotice;
});