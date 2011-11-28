/**
 * Javascript hook interface
 */
define('elgg/hooks', [
    'elgg', 
    'elgg/structs/PriorityList'
], function(elgg, PriorityList) {
	var hooks = elgg.provide('elgg.hooks');
	
	// Store registered handlers
	var registry = {};
	var instant_registry = {};
	var triggered_registry = {};
	
	/**
	 * Registers a hook handler with the event system.
	 *
	 * The special keyword "all" can be used for either the name or the type or both
	 * and means to call that handler for all of those hooks.
	 *
	 * Note that handlers registering for instant hooks will be executed immediately if the instant
	 * hook has been previously triggered.
	 *
	 * @param {!String}  name     Name of the plugin hook to register for
	 * @param {!String}  type     Type of the event to register for
	 * @param {Function} handler  Handle to call
	 * @param {number}   priority Priority to call the event handler
	 * 
	 * @return {boolean}
	 */
	hooks.registerHandler = function(name, type, handler, priority) {
		elgg.provide(name + '.' + type, registry);
		
		if (!(registry[name][type] instanceof PriorityList)) {
			registry[name][type] = new PriorityList();
		}
		
		// call if instant and already triggered.
		if (hooks.isInstant(name, type) && hooks.isTriggered(name, type)) {
			handler(name, type, null, null);
		}
		
		return registry[name][type].insert(handler, priority);
	};

	
	/**
	 * Emits a hook.
	 *
	 * Loops through all registered hooks and calls the handler functions in order.
	 * Every handler function will always be called, regardless of the return value.
	 *
	 * @warning Handlers take the same 4 arguments in the same order as when calling this function.
	 * This is different from the PHP version!
	 *
	 * @note Instant hooks do not support params or values.
	 *
	 * Hooks are called in this order:
	 *	specifically registered (event_name and event_type match)
	 *	all names, specific type
	 *	specific name, all types
	 *	all names, all types
	 *
	 * @param {String} name   Name of the hook to emit
	 * @param {String} type   Type of the hook to emit
	 * @param {Object} params Optional parameters to pass to the handlers
	 * @param {Object} value  Initial value of the return. Can be mangled by handlers
	 *
	 * @return {boolean}
	 */
	hooks.trigger = function(name, type, params, value) {
		// mark as triggered
		hooks.setTriggered(name, type);
		
		// default to true if unpassed
		value = value || true;
		
		tempReturnValue = null,
		returnValue = value,
		callHookHandler = function(handler) {
			tempReturnValue = handler(name, type, params, value);
		};
		
		elgg.provide(name + '.' + type, registry);
		elgg.provide('all.' + type, registry);
		elgg.provide(name + '.all', registry);
		elgg.provide('all.all', registry);
		
		var hooksList = [];
		
		if (name != 'all' && type != 'all') {
			hooksList.push(registry[name][type]);
		}
		
		if (type != 'all') {
			hooksList.push(registry['all'][type]);
		}
		
		if (name != 'all') {
			hooksList.push(registry[name]['all']);
		}
		
		hooksList.push(registry['all']['all']);
		
		hooksList.forEach(function(handlers) {
			if (handlers instanceof PriorityList) {
				handlers.forEach(callHookHandler);
			}
		});
		
		return (tempReturnValue !== null) ? tempReturnValue : returnValue;
	};
	

	/**
	 * Registers a hook as an instant hook.
	 *
	 * After being triggered once, registration of a handler to an instant hook will cause the
	 * handle to be executed immediately.
	 *
	 * @note Instant hooks must be triggered without params or defaults. Any params or default
	 * passed will *not* be passed to handlers executed upon registration.
	 *
	 * @param {String} name The hook name.
	 * @param {String} type The hook type.
	 * 
	 * @return {number}
	 */
	hooks.registerInstant = function(name, type) {
		return elgg.push_to_object_array(instant_registry, name, type);
	};
	

	/**
	 * Is this hook registered as an instant hook?
	 *
	 * @param {String} name The hook name.
	 * @param {String} type The hook type.
	 */
	hooks.isInstant = function(name, type) {
		return elgg.is_in_object_array(instant_registry, name, type);
	};
	
	/**
	 * Records that a hook has been triggered.
	 *
	 * @param {String} name The hook name.
	 * @param {String} type The hook type.
	 */
	hooks.setTriggered = function(name, type) {
		return elgg.push_to_object_array(triggered_registry, name, type);
	};
	
	/**
	 * Has this hook been triggered yet?
	 *
	 * @param {String} name The hook name.
	 * @param {String} type The hook type.
	 */
	hooks.isTriggered = function(name, type) {
		return elgg.is_in_object_array(triggered_registry, name, type);
	};
	
	hooks.registerInstant('init', 'system');
	hooks.registerInstant('ready', 'system');
	hooks.registerInstant('boot', 'system');
	
	
	/** 
	 * @deprecated Use elgg.hooks.registerHandler instead.
	 */
	elgg.register_hook_handler = hooks.registerHandler;
	
	
	/** 
	 * @deprecated Use elgg.hooks.trigger instead.
	 */
	elgg.trigger_hook = hooks.trigger;
	
	
	/**
	 * @deprecated Use elgg.hooks.isTriggered instead.
	 */
	elgg.is_triggered_hook = hooks.isTriggered;

	
	/**
	 * @deprecated Use elgg.hooks.setTriggered instead.
	 */
	elgg.set_triggered_hook = hooks.setTriggered;
	
	
	/**
	 * @deprecated Use elgg.hooks.registerInstant instead.
	 */
	elgg.register_instant_hook = hooks.registerInstant;

	
	/**
	 * @deprecated Use elgg.hooks.isInstant instead.
	 */
	elgg.is_instant_hook = hooks.isInstant;
	
	return hooks;
});
