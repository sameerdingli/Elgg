<?php
/**
 * A class for logging messages at different levels of severity.
 * 
 * @example 
 * Turn off logging
 * <pre>
 * $logger = ElggLogger::getInstance();
 * $logger->setLevel('NONE');
 * </pre>
 * 
 */
class ElggLogger {

	// Always display errors by default
	private $level = 'ERROR';

	// The Elgg version we're logging for (needed for deprecation messages)
	private $version;

	// Log levels
	private static $levels = array(
		'DEBUG' => 4,
		'NOTICE' => 3,
		'WARNING' => 2,
		'ERROR' => 1,
		'NONE' => 0,
	);

	public function __construct($version) {
		$this->version = $version;
	}

	/**
	 * Log or display a message.
	 * 
	 * Only messages that as serious as the level of this logger will be logged.
	 * For example, if the logger is set to ERROR, messages with level NOTICE will
	 * not be logged at all.
	 *
	 * @param str $message User message
	 * @param str $level   The level to log this message at
	 *
	 * @return bool
	 */
	public function log($message, $level) {
		$intLevel = self::$levels[$level];

		// Never log messages with invalid levels
		if (!isset($intLevel)) {
			// @todo log the fact that an invalid level was used?
			return false;
		}

		// Only log messages that are as serious as the level of this logger
		if ($intLevel > self::$levels[$this->level]) {
			return false;
		}

		// We don't ever want to put notices or debug messages on screen
		// That would just be too cluttered...
		$to_screen = $intLevel < self::$levels['NOTICE'];

		// Allow plugins to prevent/customize logging
		$params = array(
			'level' => $level,
			'msg' => $value,
			'to_screen' => $to_screen,
		);

		if (!elgg_trigger_plugin_hook('debug', 'log', $params, true)) {
			return false;
		}

		// Finally, log the message!
		return $this->dump($message, $to_screen);
	}

	/**
	 * Sends a notice about deprecated use of a function, view, etc.
	 *
	 * This function either displays or logs the deprecation message,
	 * depending upon the deprecation policies in {@link CODING.txt}.
	 * Logged messages are sent with the level of 'WARNING'.
	 *
	 * A user-visual message will be displayed if $dep_version is greater
	 * than 1 minor releases lower than the current Elgg version, or at all
	 * lower than the current Elgg major version.
	 *
	 * @note This will always at least log a warning.  Don't use to pre-deprecate things.
	 * This assumes we are releasing in order and deprecating according to policy.
	 *
	 * @see CODING.txt
	 *
	 * @param str $msg             Message to log / display.
	 * @param str $dep_version     Human-readable *release* version: '1.7', '1.7.3'
	 * @param int $backtrace_level How many levels back to display the backtrace. Useful if calling from
	 *                             functions that are called from other places (like elgg_view()). Set
	 *                             to -1 for a full backtrace.
	 *
	 * @return bool
	 */
	public function deprecatedNotice($msg, $dep_version, $backtrace_level = 1) {
		// if it's a major release behind, visual and logged
		// if it's a 1 minor release behind, visual and logged
		// if it's for current minor release, logged.
		// bugfixes don't matter because you're not deprecating between them, RIGHT?

		if (!$dep_version) {
			return FALSE;
		}

		$elgg_version_arr = explode('.', $this->version);
		$elgg_major_version = (int)$elgg_version_arr[0];
		$elgg_minor_version = (int)$elgg_version_arr[1];

		$dep_major_version = (int)$dep_version;
		$dep_minor_version = 10 * ($dep_version - $dep_major_version);

		$visual = ($dep_major_version < $elgg_major_version) || ($dep_minor_version < $elgg_minor_version);

		$msg = "Deprecated in $dep_major_version.$dep_minor_version: $msg";

		if ($visual) {
			register_error($msg);
		}

		// Get a file and line number for the log. Never show this in the UI.
		// Skip over the function that sent this notice and see who called the deprecated
		// function itself.
		$msg .= " Called from ";
		$stack = array();
		$backtrace = debug_backtrace();
		// never show this call.
		array_shift($backtrace);
		$i = count($backtrace);

		foreach ($backtrace as $trace) {
			$stack[] = "[#$i] {$trace['file']}:{$trace['line']}";
			$i--;

			if ($backtrace_level > 0) {
				if ($backtrace_level <= 1) {
					break;
				}
				$backtrace_level--;
			}
		}

		$msg .= implode("<br /> -> ", $stack);

		return $this->log($msg, 'WARNING');
	}

	public function setLevel($level) {
		$this->level = $level;
	}

	/**
	 * Logs or displays $value.
	 *
	 * If $to_screen is true, $value is displayed to screen.  Else,
	 * it is handled by PHP's {@link error_log()} function.
	 *
	 * A {@elgg_plugin_hook debug log} is called.  If a handler returns
	 * false, it will stop the default logging method.
	 *
	 * @param mixed  $value     The value
	 * @param bool   $to_screen Display to screen?
	 * @param string $level     The debug level
	 *
	 * @return void
	 */
	private function dump($value, $to_screen = TRUE) {
		if ($to_screen == TRUE) {
			echo '<pre>', print_r($value), '</pre>';
		} else {
			error_log(print_r($value, TRUE));
		}
		
		return TRUE;
	}

	private static $instance;

	// Allow static access. Used by elgg_log()
	public static function getInstance() {
		if (!self::$instance) {
			self::$instance = new ElggLogger(get_version(true));
		}

		return self::$instance;
	}
}
