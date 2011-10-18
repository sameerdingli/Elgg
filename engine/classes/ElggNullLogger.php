<?php
/**
 * A helper class that does nothing so we can avoid filling our code with
 * tons of if (isset($logger)) { ... } blocks.
 */
class ElggNullLogger extends ElggLogger {
	public function log($message, $level) {
		return TRUE;
	}

	public function deprecatedNotice($msg, $dep_version, $backtrace_level = 1) {
		return TRUE;
	}
}
