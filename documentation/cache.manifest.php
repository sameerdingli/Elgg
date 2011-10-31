<?php
header('Content-type: text/cache-manifest');

include dirname(__FILE__) . '/settings.php';

echo <<<MANIFEST
CACHE MANIFEST
{$root}/style.css
MANIFEST;
