<?php

$max = 24;

for ($i = 0; $i < $max; $i++) {
    $zl = ($i + 1) . "/$max";
    $perc = 100 * (($i + 1) / $max);
    echo "'{$zl}': '{$perc}%'," . PHP_EOL;
}