<?php
class ElggDB {
	
	private $prefix;
	private $cache;
	private $readlink;
	private $writelink;
	private $logger;
	
	public function __construct($prefix) {
		$this->prefix = $prefix;
		
		// Null cache by default
		$this->cache = new ElggNullSharedMemoryCache();
		
		// Null logger by default
		$this->logger = new ElggNullLogger();
	}
	
	public function setCache(ElggSharedMemoryCache $cache) {
		$this->cache = $cache;
	}
	
	public function setLogger(ElggLogger $logger) {
		$this->logger = $logger;
	}
		
	public function execute($query, $write = true) {
		return mysql_query($query, $write ? $this->writelink : $this->readlink);
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
		$query = $this->formatQuery($query);
		$this->logger->log("DB query $query", 'NOTICE');
		
		// Invalidate query cache
		$this->cache->clear();
		$this->logger->log("Query cache invalidated", 'NOTICE');
		
		if ($this->execute($query, true)) {
			return mysql_insert_id($dblink);
		}
	
		return FALSE;
	}
	
	public function updateData($query) {
		$query = $this->formatQuery($query);
		$this->logger->log("DB query $query", 'NOTICE');
	
		// Invalidate query cache
		$this->cache->clear();
		$this->logger->log("Query cache invalidated", 'NOTICE');
	
		return !!$this->execute("$query", true);
	}
	
	public function deleteData($query) {
		$query = $this->formatQuery($query);
		$this->logger->log("DB query $query", 'NOTICE');
	
		$dblink = get_db_link('write');
	
		// Invalidate query cache
		$this->cache->clear();
		$this->logger->log("Query cache invalidated", 'NOTICE');
	
		if ($this->execute("$query", true)) {
			return mysql_affected_rows($dblink);
		}
	
		return FALSE;	
	}
	
	public function setDatalist($name, $value) {
		return datalist_set($name, $value);
	}
	
	public function getDatalist($name) {
		return datalist_get($name);
	}
	
	public function getConfig($name, ElggSite $site) {
		$name = $this->escapeString($name);
		
		// check for deprecated values.
		// @todo might be a better spot to define this?
		$new_name = false;
		switch($name) {
			case 'viewpath':
				$new_name = 'view_path';
				$dep_version = 1.8;
				break;
		
			case 'pluginspath':
				$new_name = 'plugins_path';
				$dep_version = 1.8;
				break;
		
			case 'sitename':
				$new_name = 'site_name';
				$dep_version = 1.8;
				break;
		}
		
		// show dep message
		if ($new_name) {
			$name = $new_name;
			$this->logger->deprecatedNotice($msg, $dep_version);
		}
		
		$result = $this->getDataRow("SELECT value FROM {$this->prefix}config
				WHERE name = '$name' and site_guid = $site->guid");
		
		return $result ? unserialize($result->value) : null;
	}
	
	public function setConfig($name, $value, ElggSite $site) {
		$name = trim($name);
		
		// cannot store anything longer than 32 characters in db, so catch before we set
		if (elgg_strlen($name) > 32) {
			$this->logger->log("The name length for configuration variables cannot be greater than 32", "ERROR");
			return false;
		}
		
		// Unset existing
		$this->unsetConfig($name, $site);
		
		$value = $this->escapeString(serialize($value));
		
		$query = "insert into {$this->prefix}config"
		. " set name = '$name', value = '$value', site_guid = $site->guid";

		return $this->insertData($query) !== false;		
	}
	
	public function unsetConfig($name, ElggSite $site) {
		$name = $this->escapeString($name);
		
		$query = "delete from {$this->prefix}config where name = '$name' and site_guid = $site->guid";
		return $this->deleteData($query);
	}	
	
	private static $instance;
	
	public static function getInstance() {
		global $CONFIG;
		
		if (!isset(self::$instance)) {
			self::$instance = new ElggDB($CONFIG->dbprefix, ElggMemcache::getInstance());
		}
		
		return self::$instance;
	}
}