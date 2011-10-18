elgg.ui.Button = function(options) {
    this.super_(options);
    
    this.type_ = this.options_.type || elgg.ui.Button.Style.DEFAULT;
    
    this.checked_ = this.options_.checked;
    
    this.selected_ = this.options_.selected;
    
    this.disabled_ = this.options_.disabled;
    
    this.active_ = false;
};

elgg.inherit(elgg.ui.Button, elgg.ui.Control);

elgg.ui.Button.Type = {
    DEFAULT: 'action',
    ACTION: 'action',
    DELETE: 'delete',
    CANCEL: 'cancel',
    SUBMIT: 'submit',
    SPECIAL: 'special'
};

elgg.ui.Button.TYPE_CSS = {
    'action': 'elgg-button-action',
    'delete': 'elgg-button-delete',
    'cancel': 'elgg-button-cancel',
    'submit': 'elgg-button-submit',
    'special': 'elgg-button-special'
};

elgg.ui.Button.prototype.decorate = function(element) {
    this.super_('decorate', element);
    
    this.addClass('elgg-button');
    
    this.setEnabled(!this.disabled_);
    this.setType(this.type_);
    
    this.addEventListener('focus', this.onFocus, false, this);
    this.addEventListener('blur', this.onBlur, false, this);
    this.addEventListener('mousedown', this.onMouseDown, false, this);
    this.addEventListener('mouseup', this.onMouseUp, false, this);
    this.addEventListener('mouseenter', this.onMouseEnter, false, this);
    this.addEventListener('mouseleave', this.onMouseLeave, false, this);
    
    return this;
};

elgg.ui.Button.prototype.onFocus = function(e) {
    this.addClass('elgg-state-focus');
};

elgg.ui.Button.prototype.onBlur = function(e) {
    this.removeClass('elgg-state-focus');
};

elgg.ui.Button.prototype.onMouseDown = function(e) {
    if (!this.isEnabled()) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    this.setActive(true);
};

elgg.ui.Button.prototype.onMouseUp = function(e) {
    this.setActive(false);
};

elgg.ui.Button.prototype.onClick = function(e) {
    if (!this.isEnabled()) {
        return false;
    }
};

elgg.ui.Button.prototype.onMouseEnter = function(e) {
    if (!this.isEnabled()) {
        return false;
    }

    this.setHover(true);
};

elgg.ui.Button.prototype.onMouseLeave = function(e) {
    this.setActive(false);
    this.setHover(false);
};

elgg.ui.Button.prototype.setHover = function(hover) {
    this.hover_ = !!hover;
    
    if (this.hover_) {
        this.addClass('elgg-state-hover');
    } else {
        this.removeClass('elgg-state-hover');
    }
    
    return this;
};

elgg.ui.Button.prototype.setEnabled = function(enabled) {
    return enabled ? this.enable() : this.disable();
};

elgg.ui.Button.prototype.isEnabled = function() {
    return !this.disabled_;
};

elgg.ui.Button.prototype.enable = function() {
    this.disabled_ = false;
    this.removeClass('elgg-state-disabled');
    this.removeAttribute('disabled');
    this.removeAttribute('aria-disabled');
    this.setAttribute('tabindex', 0);
    return this;
};

elgg.ui.Button.prototype.disable = function() {
    this.disabled_ = true;
    this.addClass('elgg-state-disabled');
    this.setAttribute('disabled', true);
    this.setAttribute('aria-disabled', true);
    this.setAttribute('tabindex', -1);
    return this;
};

elgg.ui.Button.prototype.setFocusable = function(focusable) {
    return this.setAttribute('tabindex', focusable ? 0 : -1);
};

elgg.ui.Button.prototype.focus = function() {
    this.$element_.focus();
    return this;
};

elgg.ui.Button.prototype.blur = function() {
    this.$element_.blur();
    return this;
};

elgg.ui.Button.prototype.setFocus = function(focus) {
    return !!focus ? this.focus() : this.blur();
};

elgg.ui.Button.prototype.setType = function(type) {
    this.removeClass('elgg-button-' + this.type_);
    this.type_ = type;
    this.addClass('elgg-button-' + this.type_);
    return this;
};

elgg.ui.Button.prototype.setActive = function(active) {
    this.active_ = !!active;
    
    if (this.active_) {
        this.addClass('elgg-state-active');
    } else {
        this.removeClass('elgg-state-active');
    }
    
    return this;
};

elgg.ui.Button.prototype.isActive = function() {
    return this.active_;
};