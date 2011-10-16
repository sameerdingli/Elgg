elgg.ui.Component = function(options) {
    this.super_();
    
    this.options_ = options || {};    

    this.hidden_ = this.options_.hidden;
};

elgg.inherit(elgg.ui.Component, elgg.Object);

elgg.ui.Component.prototype.decorate = function(element) {
    this.element_ = element;
    this.$element_ = $(element);
    
    if (this.hidden_ == undefined) {
        this.setHidden(this.hasClass('elgg-state-hidden'));
    } else {
        this.setHidden(this.hidden_);        
    }
};

elgg.ui.Component.prototype.setAttribute = function(name, value) {
    this.$element_.attr(name, value);
    return this;
};

elgg.ui.Component.prototype.hasAttribute = function(name) {
    var attr = this.$element_.attr(name);
    return attr !== undefined && attr !== false;
};

elgg.ui.Component.prototype.removeAttribute = function(name) {
    this.$element_.removeAttr(name);
    return this;
};

elgg.ui.Component.prototype.addClass = function(className) {
    this.$element_.addClass(className);
    return this;
};

elgg.ui.Component.prototype.hasClass = function(className) {
    return this.$element_.hasClass(className);
};

elgg.ui.Component.prototype.removeClass = function(className) {
    this.$element_.removeClass(className);
    return this;
};

//TODO(ewinslow): I think this is wrong. Shouldn't automatically bind to "this"
elgg.ui.Component.prototype.addEventListener = function(event, callback, capture) {
    this.$element_.bind(event, this.bind(callback));
    return this;
};

elgg.ui.Component.prototype.removeEventListener = function(event, callback, capture) {
    this.$element_.unbind(event, callback);
    return this;
};

elgg.ui.Component.prototype.show = function() {
    this.hidden_ = false;
    this.removeClass('elgg-state-hidden');
    this.removeAttribute('aria-hidden');
    return this;
};

elgg.ui.Component.prototype.hide = function() {
    this.hidden_ = true;
    this.addClass('elgg-state-hidden');
    this.setAttribute('aria-hidden', true);
    return this;
};

elgg.ui.Component.prototype.setHidden = function(hidden) {
    return !!hidden ? this.hide() : this.show();
};

elgg.ui.Component.prototype.isHidden = function() {
    return this.hidden_;
};
