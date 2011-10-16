/**
 * 
 */

/**
 * Displays system messages via javascript rather than php.
 *
 * @param {String} msgs The message we want to display
 * @param {Number} delay The amount of time to display the message in milliseconds. Defaults to 6 seconds.
 * @param {String} type The type of message (typically 'error' or 'message')
 * @private
 */
elgg.system_messages = function(msgs, delay, type) {
	if (elgg.isUndefined(msgs)) {
		return;
	}

	var classes = ['elgg-message'],
		messages_html = [],
		appendMessage = function(msg) {
			messages_html.push('<li class="' + classes.join(' ') + '"><p>' + msg + '</p></li>');
		},
		systemMessages = $('ul.elgg-system-messages'),
		i;

	//validate delay.  Must be a positive integer.
	delay = parseInt(delay || 6000, 10);
	if (isNaN(delay) || delay <= 0) {
		delay = 6000;
	}

	//Handle non-arrays
	if (!elgg.isArray(msgs)) {
		msgs = [msgs];
	}

	if (type === 'error') {
		classes.push('elgg-state-error');
	} else {
		classes.push('elgg-state-success');
	}

	msgs.forEach(appendMessage);

	$(messages_html.join('')).appendTo(systemMessages)
		.animate({opacity: '1.0'}, delay).fadeOut('slow');
};

/**
 * Wrapper function for system_messages. Specifies "messages" as the type of message
 * @param {String} msgs  The message to display
 * @param {Number} delay How long to display the message (milliseconds)
 */
elgg.system_message = function(msgs, delay) {
	elgg.system_messages(msgs, delay, "message");
};

/**
 * Wrapper function for system_messages.  Specifies "errors" as the type of message
 * @param {String} errors The error message to display
 * @param {Number} delay  How long to dispaly the error message (milliseconds)
 */
elgg.register_error = function(errors, delay) {
	elgg.system_messages(errors, delay, "error");
};