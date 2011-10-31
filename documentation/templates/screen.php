<!DOCTYPE html>
<html<?php if ($appcache) { echo " manifest=\"$root/cache.manifest\""; } ?>>
<head>
	<meta charset="UTF-8" />
	<meta content="IE=edge;chrome=1" http-equiv="X-UA-Compatible" />
	<meta content="index, follow" name="robots" />
	
	<base href="<?php echo $base; ?>" />
	
	<title><?php echo $title; ?> -- Elgg Documentation</title>
	
	<link rel="canonical" href="<?php echo $canonical; ?>" />
	<link rel="stylesheet" href="<?php echo $root; ?>/assets/screen.css" />
</head>
<body>
	<div class="page">
		<nav class="topbar">
			
		</nav>
		<nav class="sidebar">
			<?php echo Markdown(view("$language/sidebar")); ?>			
		</nav>
		<section class="body">
			<?php echo $content; ?>
		</section>
		<footer class="footer">
		
		</footer>
	</div>
</body>
</html>