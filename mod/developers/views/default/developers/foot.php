<?php
global $START_MICROTIME;

$total = (int)((microtime(true) - $START_MICROTIME)*1000);
echo "The page took about $total milliseconds<br/>";