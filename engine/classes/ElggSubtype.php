<?php
class ElggSubtype {
	private static $subtypes = array();
	
	/**
	 * Load the subtypes table into memory
	 */
	public static function loadTable() {
		$rows = get_data("SELECT * FROM {$CONFIG->dbprefix}entity_subtypes");

		self::$subtypes = array();
		foreach ($rows as $row) {
			self::$subtypes[] = new ElggSubtype($row);
		}
	}
	
	/**
	 * Get a subtype object by its id.
	 * 
	 * @param int $id
	 * @return ElggSubtype
	 */
	public static function findById($id) {
		if (empty(self::$subtypes)) {
			self::loadTable();
		}
		
		foreach (self::$subtypes as $subtype) {
			if ($subtype->id === $id) {
				return $subtype;
			}
		}
	}
	
	/**
	 * Get a subtype object by its type and subtype.
	 * 
	 * @param string $type
	 * @param string $subtype
	 */
	public static function findByType($type, $subtype) {
		if (empty(self::$subtypes)) {
			self::loadTable();
		}
		
		foreach (self::$subtypes as $subtypeObj) {
			if ($subtypeObj->type == $type && $subtypeObj->subtype == $subtype) {
				return $subtypeObj;
			}
		}
	}
	
	/**
	 * Get a subtype object by its class.
	 * 
	 * @param string $class
	 */
	public static function findByClass($class) {
		if (empty(self::$subtypes)) {
			self::loadTable();
		}
		
		foreach (self::$subtypes as $subtype) {
			if ($subtype->class == $class) {
				return $subtype;
			}
		}
	}
	
	/** @var int */
	private $id;
	
	/** @var string */
	public $type;
	
	/** @var string */
	public $subtype;
	
	/** @var string */
	public $class;
	
	public function __construct(stdClass $row = NULL) {
		if (isset($row)) {
			$this->id = $row->id;
			$this->type = $row->type;
			$this->subtype = $row->subtype;
			$this->class = $row->class;
		}
	}
	
	public function save() {
		$obj = self::findByType($this->type, $this->subtype);
		
		if ($obj) {
			return $this->update();
		} else {
			return $this->create();
		}
	}
	
	public function create() {
		$type = sanitise_string($this->type);
		$subtype = sanitise_string($this->subtype);
		$class = sanitise_string($this->class);
		
		global $CONFIG;
		return insert_data("insert into {$CONFIG->dbprefix}entity_subtypes"
		. " (type, subtype, class) values ('$type','$subtype','$class')");
	}
	
	public function update() {
		$id = (int)$this->id;
		$type = sanitize_string($this->type);
		$subtype = sanitize_string($this->subtype);
		$class = sanitize_string($this->class);
		
		global $CONFIG;
		return update_data("UPDATE {$CONFIG->dbprefix}entity_subtypes
							SET type = '$type', subtype = '$subtype', class = '$class'
							WHERE id = $id");
	}
		
	public function delete() {
		$id = (int)$this->id;
		
		global $CONFIG;
		return delete_data("DELETE FROM {$CONFIG->dbprefix}entity_subtypes WHERE id = $id");
	}
	
	public function __toString() {
		return $this->subtype;
	}
}