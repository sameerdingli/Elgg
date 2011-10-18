<?php
class ElggDB {
	protected $prefix;
	
	protected $readlink;
	protected $writelink;
	
	protected $cache;
	protected $logger;
	
	public function __construct($readlink, $writelink, $prefix) {
		$this->readlink = $readlink;
		$this->writelink = $writelink;
		$this->prefix = $prefix;
		$this->cache = new ElggNullCache();
		$this->logger = new ElggNullLogger();
	}
	
	public function setCache(ElggCache $cache) {
		$this->cache = $cache;
	}
	
	public function setLogger(ElggLogger $logger) {
		$this->logger = $logger;
	}
		
	protected function query($query, $write = true) {
		$this->logger->log("DB query $query", 'NOTICE');
		return mysql_query($query, $write ? $this->writelink : $this->readlink);
	}
	
	/**
	 * Remove newlines and extra spaces so logs are easier to read
	 */
	protected function formatQuery($query) {
		return preg_replace('/\s\s+/', ' ', $query);
	}
	
	protected function getData($query, $callback = '', $single = false) {
		$query = $this->formatQuery($query);
	
		// since we want to cache results of running the callback, we need to
		// need to namespace the query with the callback, and single result request.
		$hash = (string)$callback . (string)$single . $query;
	
		// Is cached?
		$cached_query = $this->cache->load($hash);

		if ($cached_query !== FALSE) {
			$this->logger->log("DB query $query results returned from cache (hash: $hash)", 'NOTICE');
			return $cached_query;
		}
	
		$return = array();
			
		if ($result = $this->query($query, false)) {
			// test for callback once instead of on each iteration.
			// @todo check profiling to see if this needs to be broken out into
			// explicit cases instead of checking in the interation.
			$is_callable = is_callable($callback);
			while ($row = $this->fetchObject($result)) {
				if ($is_callable) {
					$row = $callback($row);
				}
	
				if ($single) {
					$return = $row;
					break;
				} else {
					$return[] = $row;
				}
			}
		}
		
		if (empty($return)) {
			$this->logger->log("DB query $query returned no results.", 'NOTICE');
		}
		
		$this->cache->save($hash, $return);
		$this->logger->log("DB query $query results cached (hash: $hash)", 'NOTICE');
		
		return $return;
	}
	
	protected function getDataRow($query, $callback = '') {
		return $this->getData($query, $callback, true);
	}
	
	protected function fetchObject($result) {
		return mysql_fetch_object($result);
	}
	
	protected function insertData($query) {
		$query = $this->formatQuery($query);
		
		// Invalidate query cache
		$this->cache->clear();
		$this->logger->log("Query cache invalidated by insert", 'NOTICE');
		
		return $this->query($query);
	}
	
	protected function updateData($query) {
		$query = $this->formatQuery($query);
	
		$this->cache->clear();
		$this->logger->log("Query cache invalidated by update", 'NOTICE');
	
		return $this->query($query);
	}
	
	protected function deleteData($query) {
		$query = $this->formatQuery($query);
	
		$this->cache->clear();
		$this->logger->log("Query cache invalidated by delete", 'NOTICE');
	
		return $this->query($query);
	}
	
	public function setDatalist($name, $value) {
		return datalist_set($name, $value);
	}
	
	public function getDatalist($name) {
		return datalist_get($name);
	}
	
	public function getConfig($name, $site_guid) {
		
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
		
		$name = $this->quote($name, false);
		$site_guid = (int)$site_guid;
		
		$query = "SELECT value FROM {$this->prefix}config WHERE name = '$name' AND site_guid = $site_guid";
		$result = $this->getData($query, '', true);
		
		return $result ? unserialize($result->value) : null;
	}
	
	public function setConfig($name, $value, $site_guid) {
		// cannot store anything longer than 32 bytes in db, so catch before we set
		if (strlen($name) > 32) {
			$this->logger->log("The name length for configuration variables cannot be greater than 32", "ERROR");
			return false;
		}
		
		// Unset existing
		$this->unsetConfig($name, $site_guid);
		
		$value = $this->quote(serialize($value));
		$name = $this->quote($name);
		$site_guid = (int)$site_guid;
		
		$query = "INSERT INTO {$this->prefix}config "
		       . "SET name = '$name', value = '$value', site_guid = $site_guid";

		return $this->insertData($query) !== false;		
	}
	
	public function unsetConfig($name, $site_guid) {
		$name = $this->quote($name);
		$site_guid = (int)$site_guid;
		
		$query = "DELETE FROM {$this->prefix}config WHERE name = '$name' AND site_guid = $site_guid";
		return $this->deleteData($query);
	}
	
	public function getSubtypeId($type, $subtype) {
		$type = $this->quote($type, false);
		$subtype = $this->quote($subtype, false);
		
		if ($subtype == "") {
			return FALSE;
		}
		
		// Todo: cache here? Or is looping less efficient that going to the db each time?
		$query = "SELECT * FROM {$this->prefix}entity_subtypes 
		          WHERE type='$type' AND subtype='$subtype'";
		$result = $this->getDataRow($query);
		
		if ($result) {
			return $result->id;
		}
		
		return FALSE;
	}
	protected function quote($string, $write = true) {
		return mysql_real_escape_string($string, $write ? $this->writelink : $this->readlink);
	}

}