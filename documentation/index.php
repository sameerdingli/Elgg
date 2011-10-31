<?php 
require_once dirname(dirname(__FILE__)) . '/vendors/markdown/markdown.php';
require_once dirname(__FILE__) . '/settings.php';

function view($name, $language) {
	// basic security measure
	if (strpos($name, '..') !== false || strpos($language, '..') !== false) {
		return false;
	}
	
	$pages = dirname(__FILE__) . '/pages/';
	
	ob_start();

	if (!include("$pages/$language/$name.md")) {
		include("$pages/$language/$name/index.md");
	}

	$content = ob_get_clean();

	ob_end_clean();

	return $content;
}

$page = $_REQUEST['page'];

$page = trim($page, '/');

// Determine language, normalize page
if (!empty($page)) {
	$page = explode('/', $page);
	$language = array_shift($page);
	$page = implode('/', $page);
} else {
	$language = 'en';
}

$base = "$root/$language/";

$canonical = rtrim("$root/$language/$page", '/');

$content = view($page, $language);

// First line is always assumed to be title
$title = array_shift(explode("\n", $content));

// Format before inserting into page
$content = Markdown($content);

if ($debug) {
	$vars = array(
		'base' => $base,
		'canonical' => $canonical,
		'content' => $content,
		'language' => $language,
		'page' => $page,
		'title' => $title,
	);
	echo "<pre>", print_r($vars), "</pre>";
} else {
	include dirname(__FILE__) . '/templates/screen.php';
}