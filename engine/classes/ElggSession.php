<?php
/**
 * Magic session class.
 * This class is intended to extend the $_SESSION magic variable by providing an API hook
 * to plug in other values.
 *
 * Primarily this is intended to provide a way of supplying "logged in user"
 * details without touching the session (which can cause problems when
 * accessed server side).
 *
 * If a value is present in the session then that value is returned, otherwise
 * a plugin hook 'session:get', '$var' is called, where $var is the variable
 * being requested.
 *
 * Setting values will store variables in the session in the normal way.
 *
 * LIMITATIONS: You can not access multidimensional arrays
 *
 * @package    Elgg.Core
 * @subpackage Sessions
 */
class ElggSession implements ArrayAccess {
	/** Local cache of trigger retrieved variables */
	private static $__localcache;

	/**
	 * Test if property is set either as an attribute or metadata.
	 *
	 * @param string $key The name of the attribute or metadata.
	 *
	 * @return bool
	 */
	function __isset($key) {
		return $this->offsetExists($key);
	}

	/**
	 * Set a value, go straight to session.
	 *
	 * @param string $key   Name
	 * @param mixed  $value Value
	 *
	 * @return void
	 */
	function offsetSet($key, $value) {
		$_SESSION[$key] = $value;
	}

	/**
	 * Get a variable from either the session, or if its not in the session
	 * attempt to get it from an api call.
	 *
	 * @see ArrayAccess::offsetGet()
	 *
	 * @param mixed $key Name
	 *
	 * @return void
	 */
	function offsetGet($key) {
		if (!ElggSession::$__localcache) {
			ElggSession::$__localcache = array();
		}

		if (isset($_SESSION[$key])) {
			return $_SESSION[$key];
		}

		if (isset(ElggSession::$__localcache[$key])) {
			return ElggSession::$__localcache[$key];
		}

		$value = NULL;
		$value = elgg_trigger_plugin_hook('session:get', $key, NULL, $value);

		ElggSession::$__localcache[$key] = $value;

		return ElggSession::$__localcache[$key];
	}

	/**
	 * Unset a value from the cache and the session.
	 *
	 * @see ArrayAccess::offsetUnset()
	 *
	 * @param mixed $key Name
	 *
	 * @return void
	 */
	function offsetUnset($key) {
		unset(ElggSession::$__localcache[$key]);
		unset($_SESSION[$key]);
	}

	/**
	 * Return whether the value is set in either the session or the cache.
	 *
	 * @see ArrayAccess::offsetExists()
	 *
	 * @param int $offset Offset
	 *
	 * @return int
	 */
	function offsetExists($offset) {
		if (isset(ElggSession::$__localcache[$offset])) {
			return true;
		}

		if (isset($_SESSION[$offset])) {
			return true;
		}

		if ($this->offsetGet($offset)) {
			return true;
		}
	}


	/**
	 * Alias to ::offsetGet()
	 *
	 * @param string $key Name
	 *
	 * @return mixed
	 */
	function get($key) {
		return $this->offsetGet($key);
	}

	/**
	 * Alias to ::offsetSet()
	 *
	 * @param string $key   Name
	 * @param mixed  $value Value
	 *
	 * @return mixed
	 */
	function set($key, $value) {
		return $this->offsetSet($key, $value);
	}

	/**
	 * Alias to offsetUnset()
	 *
	 * @param string $key Name
	 *
	 * @return bool
	 */
	function del($key) {
		return $this->offsetUnset($key);
	}
    
    
    /**
     * Fire up an Elgg session.
     *
     * Plugins can hook into this and customize the session by listening for the
     * 'start,session' event.
     *
     * @see session_start()
     * @return boolean True if started session successfully.
     */
    function start() {
    	session_name('Elgg');
        
        elgg_trigger_event('start', 'session', $this);
    	session_start();
    
    	// Generate a simple token (private from potentially public session id)
    	if (!isset($_SESSION['__elgg_session'])) {
    		$_SESSION['__elgg_session'] = md5(microtime() . rand());
    	}
    
    	// test whether we have a user session
    	if (empty($_SESSION['guid'])) {
    
    		// clear session variables before checking cookie
    		unset($_SESSION['user']);
    		unset($_SESSION['id']);
    		unset($_SESSION['guid']);
    		unset($_SESSION['code']);
    
    		// is there a remember me cookie
    		if (isset($_COOKIE['elggperm'])) {
    			// we have a cookie, so try to log the user in
    			$code = $_COOKIE['elggperm'];
    			$code = md5($code);
    			if ($user = get_user_by_code($code)) {
    				// we have a user, log him in
    				$_SESSION['user'] = $user;
    				$_SESSION['id'] = $user->getGUID();
    				$_SESSION['guid'] = $_SESSION['id'];
    				$_SESSION['code'] = $_COOKIE['elggperm'];
    			}
    		}
    	} else {
    		// we have a session and we have already checked the fingerprint
    		// reload the user object from database in case it has changed during the session
    		if ($user = get_user($_SESSION['guid'])) {
    			$_SESSION['user'] = $user;
    			$_SESSION['id'] = $user->getGUID();
    			$_SESSION['guid'] = $_SESSION['id'];
    		} else {
    			// user must have been deleted with a session active
    			unset($_SESSION['user']);
    			unset($_SESSION['id']);
    			unset($_SESSION['guid']);
    			unset($_SESSION['code']);
    		}
    	}
    
    	if (isset($_SESSION['guid'])) {
    		set_last_action($_SESSION['guid']);
    	}
        
        // Finally we ensure that a user who has been banned with an open session is kicked.
    	if ((isset($_SESSION['user'])) && ($_SESSION['user']->isBanned())) {
    		session_destroy();
    		return false;
    	}
        
        return true;
    }
}
