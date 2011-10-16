/**
 * Provides a generic "control" abstraction. Handles things like
 * buttons, checkboxes, links, etc. Basically anything the user
 * would interact with directly.
 */
elgg.provide('elgg.ui.Control');

elgg.require('elgg.ui.Component');

elgg.ui.Control = function(options) {
	this.super_(options);
};
elgg.inherit(elgg.ui.Control, elgg.ui.Component);