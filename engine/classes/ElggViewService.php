<?php

/**
 * WARNING: API IN FLUX. DO NOT USE DIRECTLY.
 * 
 * Use the elgg_* versions instead.
 *
 * @todo 1.10 remove deprecated view injections
 * @todo inject/remove dependencies: $CONFIG, hooks, site_url
 * 
 * @access private
 * @since 1.9.0
 */
class ElggViewService {

	protected $config_wrapper;
	protected $site_url_wrapper;
	protected $user_wrapper;
	protected $user_wrapped;
	
	/**
	 * A structure holding the locations of all views.
	 */
	private $views = array(
		'default' => array(),
	);
	
	private $fallbacks = array();
	
	private $extensions = array();

	/** @var ElggPluginHookService */
	private $hooks;
	
	/** @var ElggLogger */
	private $logger;
	
	/** @var ElggSite */
	private $site;
	

	public function __construct(ElggPluginHookService $hooks, ElggLogger $logger, ElggSite $site) {
		$this->hooks = $hooks;
		$this->logger = $logger;
		$this->site = $site;
	}

	protected function getUserWrapper() {
		$user = elgg_get_logged_in_user_entity();
		if ($user) {
			if ($user !== $this->user_wrapped) {
				$warning = 'Use elgg_get_logged_in_user_entity() rather than assuming elgg_view() '
						 . 'populates $vars["user"]';
				$this->user_wrapper = new ElggDeprecationWrapper($user, $warning, 1.8);
			}
			$user = $this->user_wrapper;
		}
		return $user;
	}
	
	/**
	 * Exposing the internal structure mainly for caching.
	 * 
	 * @return array All recognized views.
	 */
	public function getViews() {
		return $this->views;
	}
	
	/**
	 * Set the currently registered views explicitly. This is useful when
	 * restoring from cache, for example.
	 */
	public function setViews(array $views) {
		$this->views = $views;		
	}
	
	public function getExtensions() {
		return $this->extensions;
	}
	
	/**
	 * Auto-registers viewtypes + views in the given location.
	 *
	 * @note Views in plugin/views/ are automatically registered for active plugins.
	 * Plugin authors would only need to call this if optionally including
	 * an entire views structure.
	 * 
	 * @param string $directory Path to a directory on this filesystem.
	 * 
	 * @private
	 */
	public function registerViews($directory) {
		$dirs = scandir($directory);
		
		foreach ($dirs as $viewtype) {
			if (strpos($viewtype, '.') !== 0 && is_dir("$directory/$viewtype")) {
				$this->registerViewtypeViews($viewtype, $directory);
			}
		}
	}
	
	/**
	 * Registers all the views in a directory as belonging to the given viewtype.
	 * 
	 * @param string $viewtype  The viewtype to register for.
	 * @param string $base_dir  The directory to recursively walk.
	 * @param string $base_view The view subdirectory that we're walking.
	 */
	private function registerViewtypeViews($viewtype, $base_dir, $base_view = '') {
		if (strpos($base_view, '.') === 0) {
			return;
		}
		
		$views_dir = "$base_dir/$viewtype";
		$views_dir = empty($base_view) ? $views_dir : "$views_dir/$base_view";
		
		$files = scandir($views_dir);
		
		foreach ($files as $file) {
			if (strpos($file, '.') === 0) {
				continue;
			}

			// Get the full path to this view
			$path = "$views_dir/$file";
			
			if (is_dir($path)) {
				$new_base_view = empty($base_view) ? $file : "$base_view/$file";
				$this->registerViewtypeViews($viewtype, $base_dir, $new_base_view);
			} else {
				$basename = basename($file, '.php');
				$full_view_name = empty($base_view) ? $basename : "$base_view/$basename";
				$this->setViewLocation($viewtype, $full_view_name, $base_dir);
			}
		}
	}
	
	
	/**
	 * Sets the location of a single view for a particular viewtype.
	 * 
	 * @param string $viewtype The viewtype.
	 * @param string $view     The view name.
	 * @param string $path     The path to the views directory containing the view.
	 */
	public function setViewLocation($viewtype, $view, $path) {
		$this->views[$viewtype][$view] = $path;
	}
	
	
	/**
	 * Get full path to the given view. Guaranteed to return the path to a valid
	 * file. Otherwise, throws.
	 * 
	 * @param string $view     The view name.
	 * @param string $viewtype The viewtype.
	 * 
	 * @return string The full path to this view for the given viewtype.
	 */
	public function getViewLocation($view, $viewtype) {
		if (!isset($this->views[$viewtype])) {
			$this->views[$viewtype] = array();
		}
		
		$path = '';
		if (isset($this->views[$viewtype][$view])) {
			$path = realpath($this->views[$viewtype][$view]);
		}
		
		
		if ((!$path || !is_dir($path)) && 
				$this->doesViewtypeFallBack($viewtype) &&
				isset($this->views['default'][$view])) {
			$path = realpath($this->views['default'][$view]);
		}
		
		if (!$path || !is_dir($path)) {
			throw new Exception("View '$view' not found for '$viewtype'");
		}
		
		return $path;
	}
	
	public function registerViewtypeFallback($viewtype) {
		$this->fallbacks[$viewtype] = true;
	}
	
	public function doesViewtypeFallBack($viewtype) {
		return isset($this->fallbacks[$viewtype]) && $this->fallbacks[$viewtype];
	}

	/**
	 * @access private
	 * @since 1.9.0
	 */
	public function renderView($view, array $vars = array(), $bypass = false, $viewtype = '') {
		global $CONFIG;

		if (!is_string($view) || !is_string($viewtype)) {
			$this->logger->log("View and Viewtype in views must be a strings: $view", 'NOTICE');
			return '';
		}
		// basic checking for bad paths
		if (strpos($view, '..') !== false) {
			return '';
		}

		if (!is_array($vars)) {
			$this->logger->log("Vars in views must be an array: $view", 'ERROR');
			$vars = array();
		}

		// Get the current viewtype
		if ($viewtype === '' || !_elgg_is_valid_viewtype($viewtype)) {
			$viewtype = elgg_get_viewtype();
		}
	
		$view_orig = $view;
	
		// Trigger the pagesetup event
		if (!isset($CONFIG->pagesetupdone) && $CONFIG->boot_complete) {
			$CONFIG->pagesetupdone = true;
			elgg_trigger_event('pagesetup', 'system');
		}
	
		// @warning - plugin authors: do not expect user, config, and url to be
		// set by elgg_view() in the future. Instead, use elgg_get_logged_in_user_entity(),
		// elgg_get_config(), and elgg_get_site_url() in your views.
		if (!isset($vars['user'])) {
			$vars['user'] = $this->getUserWrapper();
		}
		if (!isset($vars['config'])) {
			if (!$this->config_wrapper) {
				$warning = 'Use elgg_get_config() rather than assuming elgg_view() populates $vars["config"]';
				$this->config_wrapper = new ElggDeprecationWrapper($CONFIG, $warning, 1.8);
			}
			$vars['config'] = $this->config_wrapper;
		}
		if (!isset($vars['url'])) {
			if (!$this->site_url_wrapper) {
				$warning = 'Use elgg_get_site_url() rather than assuming elgg_view() populates $vars["url"]';
				$this->site_url_wrapper = new ElggDeprecationWrapper($this->site->getURL(), $warning, 1.8);
			}
			$vars['url'] = $this->site_url_wrapper;
		}
	
		// full_view is the new preferred key for full view on entities @see elgg_view_entity()
		// check if full_view is set because that means we've already rewritten it and this is
		// coming from another view passing $vars directly.
		if (isset($vars['full']) && !isset($vars['full_view'])) {
			elgg_deprecated_notice("Use \$vars['full_view'] instead of \$vars['full']", 1.8, 2);
			$vars['full_view'] = $vars['full'];
		}
		if (isset($vars['full_view'])) {
			$vars['full'] = $vars['full_view'];
		}
	
		// internalname => name (1.8)
		if (isset($vars['internalname']) && !isset($vars['__ignoreInternalname']) && !isset($vars['name'])) {
			elgg_deprecated_notice('You should pass $vars[\'name\'] now instead of $vars[\'internalname\']', 1.8, 2);
			$vars['name'] = $vars['internalname'];
		} elseif (isset($vars['name'])) {
			if (!isset($vars['internalname'])) {
				$vars['__ignoreInternalname'] = '';
			}
			$vars['internalname'] = $vars['name'];
		}
	
		// internalid => id (1.8)
		if (isset($vars['internalid']) && !isset($vars['__ignoreInternalid']) && !isset($vars['name'])) {
			elgg_deprecated_notice('You should pass $vars[\'id\'] now instead of $vars[\'internalid\']', 1.8, 2);
			$vars['id'] = $vars['internalid'];
		} elseif (isset($vars['id'])) {
			if (!isset($vars['internalid'])) {
				$vars['__ignoreInternalid'] = '';
			}
			$vars['internalid'] = $vars['id'];
		}
	
		// If it's been requested, pass off to a template handler instead
		if ($bypass == false && isset($CONFIG->template_handler) && !empty($CONFIG->template_handler)) {
			$template_handler = $CONFIG->template_handler;
			if (is_callable($template_handler)) {
				return call_user_func($template_handler, $view, $vars);
			}
		}
	
		// Set up any extensions to the requested view
		if (isset($this->extensions[$view])) {
			$viewlist = $this->extensions[$view];
		} else {
			$viewlist = array(500 => $view);
		}
	
		// Start the output buffer, find the requested view file, and execute it
	
		$content = '';
		foreach ($viewlist as $priority => $view) {
			try {
				$view_dir = $this->getViewLocation($view, $viewtype);

				// Give priority to the PHP version to minimize misses.
				if (file_exists("$view_dir/$viewtype/$view.php")) {
					ob_start();
					include("$view_dir/$viewtype/$view.php");
					$content .= ob_get_clean();
				} elseif (file_exists("$view_dir/$viewtype/$view")) {
					$content .= file_get_contents("$view_dir/$viewtype/$view");
				}
				
				continue;
			}  catch (Exception $e) {
				$this->logger->log($e->getMessage(), 'NOTICE');
			}

			try {
				$view_dir = $this->getViewLocation($view, 'default');

				if (file_exists("$view_dir/default/$view")) {
					$content .= file_get_contents("$view_dir/default/$view");
				} elseif (file_exists("$view_dir/default/$view.php")) {
					ob_start();
					include("$view_dir/default/$view.php");
					$content .= ob_get_clean();
				}
			}  catch (Exception $e) {
				$this->logger->log($e->getMessage(), 'ERROR');
			}
			
		}
	
		// Plugin hook
		$params = array('view' => $view_orig, 'vars' => $vars, 'viewtype' => $viewtype);
		$content = $this->hooks->trigger('view', $view_orig, $params, $content);
	
		// backward compatibility with less granular hook will be gone in 2.0
		$content_tmp = $this->hooks->trigger('display', 'view', $params, $content);
	
		if ($content_tmp !== $content) {
			$content = $content_tmp;
			elgg_deprecated_notice('The display:view plugin hook is deprecated by view:view_name', 1.8);
		}
	
		return $content;
	}
	
	/**
	 * @access private
	 * @since 1.9.0
	 */
	public function viewExists($view, $viewtype = '', $recurse = true) {
		global $CONFIG;

		// Detect view type
		if ($viewtype === '' || !_elgg_is_valid_viewtype($viewtype)) {
			$viewtype = elgg_get_viewtype();
		}
	
		try {
			$location = $this->getViewLocation($view, $viewtype);
			
			return true;
		} catch (Exception $e) {}
	
		// If we got here then check whether this exists as an extension
		// We optionally recursively check whether the extended view exists also for the viewtype
		if ($recurse && isset($this->extensions[$view])) {
			foreach ($this->extensions[$view] as $view_extension) {
				// do not recursively check to stay away from infinite loops
				if ($this->viewExists($view_extension, $viewtype, false)) {
					return true;
				}
			}
		}
	
		return false;
	}

	/**
	 * @access private
	 * @since 1.9.0
	 */
	public function extendView($view, $view_extension, $priority = 501, $viewtype = '') {
		if (!isset($this->extensions[$view])) {
			$this->extensions[$view] = array(
				500 => (string) $view,
			);
		}

		// raise priority until it doesn't match one already registered
		while (isset($this->extensions[$view][$priority])) {
			$priority++;
		}
	
		$this->extensions[$view][$priority] = (string) $view_extension;
		ksort($this->extensions[$view]);

	}
	
	/**
	 * @access private
	 * @since 1.9.0
	 */
	public function unextendView($view, $view_extension) {
		if (!isset($this->extensions[$view])) {
			return FALSE;
		}
	
		$priority = array_search($view_extension, $this->extensions[$view]);
		if ($priority === FALSE) {
			return FALSE;
		}
	
		unset($this->extensions[$view][$priority]);
	
		return TRUE;
	}
}