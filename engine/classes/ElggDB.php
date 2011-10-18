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
		
	}
	
	public function setConfig($name, $value, ElggSite $site) {
		
	}
	
	public function unsetConfig($name, ElggSite $site) {
		
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