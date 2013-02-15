<?php

class ElggViewServiceTest extends PHPUnit_Framework_TestCase {
	
	public function setUp() {
		$this->viewsDir = dirname(__FILE__) . "/test_files/views";
		
		$this->hooks = new ElggPluginHookService();
		$this->logger = $this->getMock('ElggLogger', array(), array(), '', false);
		$this->site = $this->getMock('ElggSite', array(), array(), '', false);
		
		$this->views = new ElggViewService($this->hooks, $this->logger, $this->site);
		$this->views->registerViews($this->viewsDir);
	}
	
	public function testCanExtendViews() {				
		$this->views->extendView('foo', 'bar');
		
		// Unextending valid extension succeeds.
		$this->assertTrue($this->views->unextendView('foo', 'bar'));

		// Unextending non-existent extension "fails."
		$this->assertFalse($this->views->unextendView('foo', 'bar'));
	}
	
	public function testRegistersStaticFilesAsViews() {
		$this->assertTrue($this->views->viewExists('js/static.js'));
	}
	
	public function testRegistersPhpFilesAsViews() {
		$this->assertTrue($this->views->viewExists('js/interpreted.js'));
	}
	
	public function testDoesNotRegisterPrivateFilesAsViews() {
		$this->assertFalse($this->views->viewExists('js/.secret.js'));
	}
	
	public function testDoesNotUsePhpToRenderStaticViews() {
		$expected = file_get_contents("{$this->viewsDir}/default/js/static.js");
		$this->assertEquals($expected, $this->views->renderView('js/static.js'));
	}
	
	public function testUsesPhpToRenderNonStaticViews() {
		$this->assertEquals("// PHP", $this->views->renderView('js/interpreted.js'));
	}
}
