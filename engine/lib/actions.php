<?php
/**
 * Elgg Actions
 *
 * Actions are one of the primary controllers (The C in MVC) in Elgg. They are
 * registered by {@link register_elgg_action()} and are called by URL
 * http://elggsite.org/action/action_name. For URLs, a rewrite rule in
 * .htaccess passes the action name to engine/handlers/action_handler.php,
 * which dispatches the request for the action.
 *
 * An action name must be registered to a file in the system. Core actions are
 * found in /actions/ and plugin actions are usually under /mod/<plugin>/actions/.
 * It is recommended that actions be namespaced to avoid collisions.
 *
 * All actions require security tokens.  Using the {@elgg_view input/form} view
 * will automatically add tokens as hidden inputs as will the elgg_view_form()
 * function.  To manually add hidden inputs, use the {@elgg_view input/securitytoken} view.
 *
 * To include security tokens for actions called via GET, use
 * {@link elgg_add_security_tokens_to_url()} or specify is_action as true when
 * using {@lgg_view output/url}.
 *
 * Action tokens can be manually generated by using {@link generate_action_token()}.
 *
 * @tip When registered, actions can be restricted to logged in or admin users.
 *
 * @tip Action URLs should be called with a trailing / to prevent 301 redirects.
 *
 * @package Elgg.Core
 * @subpackage Actions
 * @link http://docs.elgg.org/Actions
 * @link http://docs.elgg.org/Actions/Tokens
 */

/**
 * Perform an action.
 *
 * This function executes the action with name $action as registered
 * by {@link elgg_register_action()}.
 *
 * The plugin hook 'action', $action_name will be triggered before the action
 * is executed.  If a handler returns false, it will prevent the action script
 * from being called.
 *
 * @note If an action isn't registered in the system or is registered
 * to an unavailable file the user will be forwarded to the site front
 * page and an error will be emitted via {@link register_error()}.
 *
 * @warning All actions require {@link http://docs.elgg.org/Actions/Tokens Action Tokens}.
 *
 * @param string $action    The requested action
 * @param string $forwarder Optionally, the location to forward to
 *
 * @link http://docs.elgg.org/Actions
 * @see elgg_register_action()
 *
 * @return void
 * @access private
 */
function action($action, $forwarder = "") {
	global $CONFIG;

	$action = rtrim($action, '/');

	// @todo REMOVE THESE ONCE #1509 IS IN PLACE.
	// Allow users to disable plugins without a token in order to
	// remove plugins that are incompatible.
	// Login and logout are for convenience.
	// file/download (see #2010)
	$exceptions = array(
		'admin/plugins/disable',
		'logout',
		'login',
		'file/download',
	);

	if (!in_array($action, $exceptions)) {
		// All actions require a token.
		action_gatekeeper();
	}

	$forwarder = str_replace(elgg_get_site_url(), "", $forwarder);
	$forwarder = str_replace("http://", "", $forwarder);
	$forwarder = str_replace("@", "", $forwarder);

	if (substr($forwarder, 0, 1) == "/") {
		$forwarder = substr($forwarder, 1);
	}

	if (!isset($CONFIG->actions[$action])) {
		register_error(elgg_echo('actionundefined', array($action)));
	} elseif (!elgg_is_admin_logged_in() && ($CONFIG->actions[$action]['access'] === 'admin')) {
		register_error(elgg_echo('actionunauthorized'));
	} elseif (!elgg_is_logged_in() && ($CONFIG->actions[$action]['access'] !== 'public')) {
		register_error(elgg_echo('actionloggedout'));
	} else {
		// Returning falsy doesn't produce an error
		// We assume this will be handled in the hook itself.
		// @todo make this better!
		// @todo This is only called before the primary action is called.
		if (elgg_trigger_plugin_hook('action', $action, null, true)) {
			try {
				// Include action
				if (!include($CONFIG->actions[$action]['file'])) {
					register_error(elgg_echo('actionnotfound', array($action)));
				}
			} catch (Exception $e) {
				// Handle exceptions gracefully to preserve user experience.
				// See http://trac.elgg.org/ticket/4385
				register_error($e->getMessage());
			}
		}
	}

	forward(empty($forwarder) ? REFERER : $forwarder);
}

/**
 * Registers an action.
 *
 * Actions are registered to a script in the system and are executed
 * either by the URL http://elggsite.org/action/action_name/.
 *
 * $filename must be the full path of the file to register, or a path relative
 * to the core actions/ dir.
 *
 * Actions should be namedspaced for your plugin.  Example:
 * <code>
 * elgg_register_action('myplugin/save_settings', ...);
 * </code>
 *
 * @tip Put action files under the actions/<plugin_name> directory of your plugin.
 *
 * @tip You don't need to include engine/start.php in your action files.
 *
 * @internal Actions are saved in $CONFIG->actions as an array in the form:
 * <code>
 * array(
 * 	'file' => '/location/to/file.php',
 * 	'access' => 'public', 'logged_in', or 'admin'
 * )
 * </code>
 *
 * @param string $action   The name of the action (eg "register", "account/settings/save")
 * @param string $filename Optionally, the filename where this action is located. If not specified,
 *                         will assume the action is in elgg/actions/<action>.php
 * @param string $access   Who is allowed to execute this action: public, logged_in, admin.
 *                         (default: logged_in)
 *
 * @see action()
 * @see http://docs.elgg.org/Actions
 *
 * @return bool
 */
function elgg_register_action($action, $filename = "", $access = 'logged_in') {
	global $CONFIG;

	// plugins are encouraged to call actions with a trailing / to prevent 301
	// redirects but we store the actions without it
	$action = rtrim($action, '/');

	if (!isset($CONFIG->actions)) {
		$CONFIG->actions = array();
	}

	if (empty($filename)) {
		$path = "";
		if (isset($CONFIG->path)) {
			$path = $CONFIG->path;
		}

		$filename = $path . "actions/" . $action . ".php";
	}

	$CONFIG->actions[$action] = array(
		'file' => $filename,
		'access' => $access,
	);
	return true;
}

/**
 * Unregisters an action
 *
 * @param string $action Action name
 * @return bool
 * @since 1.8.1
 */
function elgg_unregister_action($action) {
	global $CONFIG;

	if (isset($CONFIG->actions[$action])) {
		unset($CONFIG->actions[$action]);
		return true;
	} else {
		return false;
	}
}

/**
 * Validate an action token.
 *
 * Calls to actions will automatically validate tokens. If tokens are not
 * present or invalid, the action will be denied and the user will be redirected.
 *
 * Plugin authors should never have to manually validate action tokens.
 *
 * @param bool  $visibleerrors Emit {@link register_error()} errors on failure?
 * @param mixed $token         The token to test against. Default: $_REQUEST['__elgg_token']
 * @param mixed $ts            The time stamp to test against. Default: $_REQUEST['__elgg_ts']
 *
 * @return bool
 * @see generate_action_token()
 * @link http://docs.elgg.org/Actions/Tokens
 * @access private
 */
function validate_action_token($visibleerrors = TRUE, $token = NULL, $ts = NULL) {
	global $CONFIG;

	if (!$token) {
		$token = get_input('__elgg_token');
	}

	if (!$ts) {
		$ts = get_input('__elgg_ts');
	}

	if (!isset($CONFIG->action_token_timeout)) {
		// default to 2 hours
		$timeout = 2;
	} else {
		$timeout = $CONFIG->action_token_timeout;
	}

	$session_id = session_id();

	if (($token) && ($ts) && ($session_id)) {
		// generate token, check with input and forward if invalid
		$generated_token = generate_action_token($ts);

		// Validate token
		if ($token == $generated_token) {
			$hour = 60 * 60;
			$timeout = $timeout * $hour;
			$now = time();

			// Validate time to ensure its not crazy
			if ($timeout == 0 || ($ts > $now - $timeout) && ($ts < $now + $timeout)) {
				// We have already got this far, so unless anything
				// else says something to the contry we assume we're ok
				$returnval = true;

				$returnval = elgg_trigger_plugin_hook('action_gatekeeper:permissions:check', 'all', array(
					'token' => $token,
					'time' => $ts
				), $returnval);

				if ($returnval) {
					return true;
				} else if ($visibleerrors) {
					register_error(elgg_echo('actiongatekeeper:pluginprevents'));
				}
			} else if ($visibleerrors) {
				register_error(elgg_echo('actiongatekeeper:timeerror'));
			}
		} else if ($visibleerrors) {
			register_error(elgg_echo('actiongatekeeper:tokeninvalid'));
		}
	} else if ($visibleerrors) {
		register_error(elgg_echo('actiongatekeeper:missingfields'));
	}

	return FALSE;
}

/**
 * Validates the presence of action tokens.
 *
 * This function is called for all actions.  If action tokens are missing,
 * the user will be forwarded to the site front page and an error emitted.
 *
 * This function verifies form input for security features (like a generated token),
 * and forwards if they are invalid.
 *
 * @return mixed True if valid or redirects.
 * @access private
 */
function action_gatekeeper() {
	if (validate_action_token()) {
		return TRUE;
	}

	forward(REFERER, 'csrf');
}

/**
 * Generate an action token.
 *
 * Action tokens are based on timestamps as returned by {@link time()}.
 * They are valid for one hour.
 *
 * Action tokens should be passed to all actions name __elgg_ts and __elgg_token.
 *
 * @warning Action tokens are required for all actions.
 *
 * @param int $timestamp Unix timestamp
 *
 * @see @elgg_view input/securitytoken
 * @see @elgg_view input/form
 * @example actions/manual_tokens.php
 *
 * @return string|false
 * @access private
 */
function generate_action_token($timestamp) {
	$site_secret = get_site_secret();
	$session_id = session_id();
	// Session token
	$st = $_SESSION['__elgg_session'];

	if (($site_secret) && ($session_id)) {
		return md5($site_secret . $timestamp . $session_id . $st);
	}

	return FALSE;
}

/**
 * Initialise the site secret hash.
 *
 * Used during installation and saves as a datalist.
 *
 * @return mixed The site secret hash or false
 * @access private
 * @todo Move to better file.
 */
function init_site_secret() {
	$secret = md5(rand() . microtime());
	if (datalist_set('__site_secret__', $secret)) {
		return $secret;
	}

	return FALSE;
}

/**
 * Returns the site secret.
 *
 * Used to generate difficult to guess hashes for sessions and action tokens.
 *
 * @return string Site secret.
 * @access private
 * @todo Move to better file.
 */
function get_site_secret() {
	$secret = datalist_get('__site_secret__');
	if (!$secret) {
		$secret = init_site_secret();
	}

	return $secret;
}

/**
 * Check if an action is registered and its script exists.
 *
 * @param string $action Action name
 *
 * @return bool
 * @since 1.8.0
 */
function elgg_action_exists($action) {
	global $CONFIG;

	return (isset($CONFIG->actions[$action]) && file_exists($CONFIG->actions[$action]['file']));
}

/**
 * Checks whether the request was requested via ajax
 *
 * @return bool whether page was requested via ajax
 * @since 1.8.0
 */
function elgg_is_xhr() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
		&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ||
		get_input('X-Requested-With') === 'XMLHttpRequest';
}

/**
 * Catch calls to forward() in ajax request and force an exit.
 *
 * Forces response is json of the following form:
 * <pre>
 * {
 *     "current_url": "the.url.we/were/coming/from",
 *     "forward_url": "the.url.we/were/going/to",
 *     "system_messages": {
 *         "messages": ["msg1", "msg2", ...],
 *         "errors": ["err1", "err2", ...]
 *     },
 *     "status": -1 //or 0 for success if there are no error messages present
 * }
 * </pre>
 * where "system_messages" is all message registers at the point of forwarding
 *
 * @param string $hook
 * @param string $type
 * @param string $reason
 * @param array $params
 * @return void
 * @access private
 */
function ajax_forward_hook($hook, $type, $reason, $params) {
	if (elgg_is_xhr()) {
		// always pass the full structure to avoid boilerplate JS code.
		$params = array(
			'output' => '',
			'status' => 0,
			'system_messages' => array(
				'error' => array(),
				'success' => array()
			)
		);

		//grab any data echo'd in the action
		$output = ob_get_clean();

		//Avoid double-encoding in case data is json
		$json = json_decode($output);
		if (isset($json)) {
			$params['output'] = $json;
		} else {
			$params['output'] = $output;
		}

		//Grab any system messages so we can inject them via ajax too
		$system_messages = system_messages(NULL, "");

		if (isset($system_messages['success'])) {
			$params['system_messages']['success'] = $system_messages['success'];
		}

		if (isset($system_messages['error'])) {
			$params['system_messages']['error'] = $system_messages['error'];
			$params['status'] = -1;
		}

		// Check the requester can accept JSON responses, if not fall back to
		// returning JSON in a plain-text response.  Some libraries request
		// JSON in an invisible iframe which they then read from the iframe,
		// however some browsers will not accept the JSON MIME type.
		if (stripos($_SERVER['HTTP_ACCEPT'], 'application/json') === FALSE) {
			header("Content-type: text/plain");
		} else {
			header("Content-type: application/json");
		}

		echo json_encode($params);
		exit;
	}
}

/**
 * Buffer all output echo'd directly in the action for inclusion in the returned JSON.
 * @return void
 * @access private
 */
function ajax_action_hook() {
	if (elgg_is_xhr()) {
		ob_start();
	}
}

/**
 * Initialize some ajaxy actions features
 * @access private
 */
function actions_init() {
	elgg_register_action('security/refreshtoken', '', 'public');

	elgg_register_simplecache_view('js/languages/en');

	elgg_register_plugin_hook_handler('action', 'all', 'ajax_action_hook');
	elgg_register_plugin_hook_handler('forward', 'all', 'ajax_forward_hook');
}

elgg_register_event_handler('init', 'system', 'actions_init');
