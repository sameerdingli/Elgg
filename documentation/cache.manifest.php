<?php
header('Content-type: text/cache-manifest');

include dirname(__FILE__) . '/settings.php';

echo <<<MANIFEST
CACHE MANIFEST
# Version: 1

CACHE:
{$root}/assets/screen.css

# NETWORK:

# FALLBACK:

MANIFEST;
