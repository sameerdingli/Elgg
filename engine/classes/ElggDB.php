<?php
class ElggDB {
	
	private $prefix;
	private $cache;
	private $link;
	
	public function __construct($prefix, ElggSharedMemoryCache $cache) {
		$this->prefix = $prefix;
		$this->cache = $cache;
	}
		
	public function execute($query) {
		return mysql_query($query, $this->link);
	}
	
	public function runQuery($query, $callback, $single = false) {
		return elgg_query_runner($query, $callback, $single);
	}
	
	private function formatQuery($query) {
		return elgg_format_query($query);
	}
	
	public function getData($query, $callback = '') {
		return $this->runQuery($query, $callback, false);
	}
	
	public function insertData($query) {
		return insert_data($query);
	}
	
	public function updateData($query) {
		return update_data($query);
	}
	
	public function deleteData($query) {
		return delete_data($query);
	}
	
	public function setDatalist($name, $value) {
		return datalist_set($name, $value);
	}
	
	public function getDatalist($name) {
		return datalist_get($name);
	}
	
	public function getConfig($name, ElggSite $site) {
		
	}
	
	public function setConfig($name, $value, ElggSite $site) {
		
	}
	
	public function unsetConfig($name, ElggSite $site) {
		
	}	
	
	private static $instance;
	
	public static function getInstance() {
		global $CONFIG;
		
		if (!isset(self::$instance)) {
			self::$instance = new ElggDB($CONFIG->dbprefix);
		}
		
		return self::$instance;
	}
}