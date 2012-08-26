<?php
/**
 * Class to encapsulate all the routing-related functions.
 * Plugin developers should not instantiate this class directly; that is taken
 * care of by Elgg.
 */
class ElggRouter {
	private $routes = array();
	
	/**
	 * @param string $route The url pattern to match against.
	 * @param string $file  The path to the file to run when the url matches.
	 * @see elgg_register_route()
	 */
	public function registerRoute($route, $file) {
		$this->routes[$route] = $file;
	}

	/**
	 * Removes support for the given url pattern.
	 * @see elgg_unregister_route()
	 */
	public function unregisterRoute($route) {
		unset($this->routes[$route]);	
	}
	
	/**
	 * Given a url, finds a match amongst the registered routes.
	 * @param string $urlPath The URL path to match against (e.g. "/profile/ewinslow").
	 * @return array Information about the route that matches the given url.
	 */
	public function getRoute($urlPath) {
		foreach ($this->routes as $route => $file) {
			$inputs = self::match($route, $url);
			if (is_array($inputs)) {
				return array(
					'route' => $route,
					'location' => $file,
					'inputs' => $inputs,
				);
			}
		}
		
		// Didn't find any matches
		return false;
	}
	
	/**
	 * @param string $route e.g. '/blog/:guid'
	 * @param string $url  e.g. '/blog/123'
	 * @return array|false Returns an array of inputs if the route matched the path. False otherwise.
	 * @access private Visible for testing.
	 */
	public static function match($route, $urlPath) {
		if (strpos($route, ':') === false) {
			// No named inputs to match, so must be exact match or fail
			return $route === $urlPath ? array() : false;
		}

		$routeRegEx = $route;
		// We know :guid implies integer
		$routeRegEx = preg_replace('/:([a-z_]+_)?guid/', '([1-9][0-9]*)', $routeRegEx);
		// Everything else is just assumed to be non-slashes
		$routeRegEx = preg_replace('/:[a-z_]+/', '([^/]+)', $routeRegEx);
						
		$pathArgValues = array();
		$count = preg_match("#^$routeRegEx$#", $urlPath, $pathArgValues);
		
		if ($count) {
			// Convert to regex for matching against $urlPath
			// E.g., /blog/:guid => /blog/([0-9]+)
			$routeArgNames = array();
			preg_match_all("/:([a-z_]+)/", $route, $routeArgNames);
			// Get the list of plain names without leading colon
			$routeArgNames = $routeArgNames[1];
			
			// First item is the whole path, which we don't need
			array_shift($pathArgValues);

			$result = array();
			foreach ($routeArgNames as $key => $name) {
				$result[$name] = $pathArgValues[$key];
			}
			return $result;
		}
		
		return false;
	}
}