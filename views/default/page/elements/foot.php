<?php

echo elgg_view('footer/analytics');

$js = elgg_get_loaded_js('footer');
foreach ($js as $script) { 
?>
	<script type="text/javascript" src="<?php echo $script; ?>"></script>
<?php
}

$asyncScripts = elgg_get_loaded_scripts('async');
$scripts = array();
foreach ($asyncScripts as $script) {
	$scripts[] = $script->name;
}

if (!empty($scripts)) {
?>
<script>require(<?php echo json_encode($scripts); ?>);</script>
<?php
}