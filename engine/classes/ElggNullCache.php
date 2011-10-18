<?php
/**
 * An instantiable cache that always misses. 
 * 
 * Anything cached with this cache vanishes into thin air.
 */
class ElggNullCache extends ElggCache {

	public function setVariable($variable, $value) {}

	public function getVariable($variable) { return NULL; }

	public function save($key, $data) { return TRUE; }

	public function load($key, $offset = 0, $limit = null) { return FALSE; }

	public function delete($key) { return TRUE; }

	public function clear() { return TRUE; }

	public function add($key, $data) { return TRUE; }

}