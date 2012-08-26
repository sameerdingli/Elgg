<?php
/**
 * Elgg Test ElggObject
 *
 * @package Elgg
 * @subpackage Test
 */
class ElggCoreObjectTest extends ElggCoreUnitTest {

	/**
	 * Called before each test method.
	 */
	public function setUp() {
		$this->router = new ElggRouter();
	}

	/**
	 * Called after each test method.
	 */
	public function tearDown() {
		unset($this->router);
	}

	public function testGuidOnlyMatchesIntegers() {
		$this->assertFalse(ElggRouter::match('/:guid', '/abc'));
		$this->assertFalse(ElggRouter::match('/:guid', '/0123'));
		$this->assertIdentical(ElggRouter::match('/:guid', '/123'));
	}
}