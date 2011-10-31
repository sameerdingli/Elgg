<?php 
require_once dirname(dirname(__FILE__)) . '/vendors/markdown/markdown.php';

function view($name) {
	$dir = dirname(__FILE__) . '/pages/';

	ob_start();

	if (!include("$dir/$name.md")) {
		include("$dir/$name/index.md");
	}

	$content = ob_get_clean();

	ob_end_clean();

	return $content;
}

$page = $_REQUEST['page'];

$page = trim($page, '/');

if (empty($page)) {
	$language = $page = 'en';
} else {
	$language = array_shift(split('/', $page));
}

// SETTINGS
$debug = false;
$root = '/elgg/documentation/';



$base = $root . $language . '/';

$canonical = rtrim($root . $page, '/');

// First line is always assumed to be title
$content = view($page);
$title = array_shift(explode("\n", $content));
$content = Markdown($content);

if ($debug) {
	$vars = array(
		'base' => $base,
		'canonical' => $canonical,
		'content' => $content,
		'language' => $language,
		'page' => $page,
		'root' => $root,
		'title' => $title,
	);
	echo "<pre>", print_r($vars), "</pre>";
} else {
	include dirname(__FILE__) . '/templates/screen.php';
}