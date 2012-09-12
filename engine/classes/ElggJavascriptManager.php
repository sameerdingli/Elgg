<?php

/**
 * This class is a registry of all Elgg's javascripts.
 * @since 1.9
 */
class ElggJavascriptManager {
	private $map = array();
	
	/** Records load order of scripts */
	private $list;

	public function __construct() {
		$this->list = new ElggPriorityList();	
	}
	
	/**
	 * TODO(evan): Support fallback urls for srcs.
	 */
	public function register($name, array $options = array()) {
		$name = (string)$name;
		
		$defaults = array(
			'name' => $name,
			'src' => elgg_get_simplecache_url('js', $name),
			'aliases' => array(),
			'deps' => array('jquery', 'jquery-ui', 'elgg'),
			'exports' => false,
			'location' => 'head',
		);
		
		$item = (object)array_merge($defaults, $options);
		$item->src = elgg_normalize_url($item->src);
		
		$this->map[$name] = $item;
		
		foreach ($item->aliases as $alias) {
			$this->map[$alias] = $item;	
		}
		
		if ($this->list->contains($item)) {
			$this->list->move($item, $item->priority);
		} else {
			$this->list->add($item, $item->priority);	
		}
		
		return $item;
	}
	
	public function get($name) {
		return $this->map[$name];	
	}
	
	public function load($name) {
		$item = $this->get($name);
		
		if (!$item) {
			$item = $this->register($name);
		}
		
		$item->loaded = true;	
	}
	
	public function unload($name) {
		$item = $this->get($name);
		
		if ($item) {
			$item->loaded = false;	
		}
	}
	
	public function unregister($name) {
		$item = $this->get($name);
		
		if ($item) {
			$this->list->remove($item);
			
			$aliases = $item->aliases;
			$aliases[] = $item->name;
			
			foreach ($aliases as $alias) {
				unset($this->map[$alias]);	
			}
		}
	}


	/** 
	 * @return string[] Script srcs to load in priority order.
	 */
	public function getLoadedSrcs($location = 'head') {
		$items = $this->getLoadedScripts($location);
		
		// Default src to simplecache view based on name
		$srcs = array();
		foreach ($items as $item) {
			$srcs[] = elgg_normalize_url($item->src);
		}
		
		return $srcs;
	}
	
	public function getLoadedScripts($location = 'head') {
		$items = $this->list->getElements();

		$callback = create_function('$v', "return \$v->loaded && \$v->location == '$location';");
		$items = array_filter($items, $callback);

		return $items;
	}
	
	public function getRegisteredScripts() {
		return $this->list->getElements();	
	}
}
