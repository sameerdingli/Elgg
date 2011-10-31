<?php 


$page = $_REQUEST['page'];

function view($name, $lang) {
	$dir = dirname(__FILE__);

	echo $dir;
	
	ob_start();
	if (!include("$dir/$lang/$name.md")) {
		include("$dir/$lang/$name/index.md");
	}
	$md = ob_get_clean();
	ob_end_clean();
	
	return "<pre>$md</pre>";
}
?>

<!DOCTYPE html>
<html>
<head>
	
</head>
<body>
	<?php echo view($page, 'en'); ?>
</body>
</html>
