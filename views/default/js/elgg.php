<?php

global $CONFIG;

?>
<?php

$prereq_files = array(
	"vendors/sprintf.js",
	"js/lib/elgglib.js",
);

foreach ($prereq_files as $file) {
	include("{$CONFIG->path}$file");
}

$model_files = array(
	'ElggEntity',
	'ElggUser',
	'ElggPriorityList',
);

foreach ($model_files as $file) {
	include("{$CONFIG->path}js/classes/$file.js");
}

//Include library files
$libs = array(
	//libraries
	'prototypes',
	'hooks',
	'security',
	'languages',
	'ajax',
	'session',
	'pageowner',
	'configuration',

	//ui
	'ui',
	'ui.widgets',
);

foreach ($libs as $file) {
	include("{$CONFIG->path}js/lib/$file.js");
	// putting a new line between the files to address http://trac.elgg.org/ticket/3081
	echo "\n";
}

?>


elgg.config.domReady = false;
elgg.config.languageReady = false;

<?php

$previous_content = elgg_view('js/initialise_elgg');
if ($previous_content) {
	elgg_deprecated_notice("The view 'js/initialise_elgg' has been deprecated for js/elgg", 1.8);
	echo $previous_content;
}

?>

define('elgg', ['jquery', 'module'], function($, module) {
	$.extend(true, elgg, module.config());
	
	//After the DOM is ready
	$(function() {
		elgg.config.domReady = true;
		elgg.initWhenReady();
	});
	
	// DOM not necessarily ready, but elgg's js framework is fully initalized
	elgg.trigger_hook('boot', 'system');
	
	return elgg;
});
// Force the factory function to run
require(['elgg']);