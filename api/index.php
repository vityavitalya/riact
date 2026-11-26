<?php

require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = dirname($_SERVER['SCRIPT_NAME']);
$path = substr($path, strlen($base));
$parts = explode('/', trim($path, '/'));

$section = $parts[0];

if ($section === 'items') {
    require 'routes/items.php';
} elseif ($section === 'auth') {
    require 'routes/auth.php';
} elseif ($section === 'cabinet') {
    require 'routes/cabinet.php';
} elseif ($section === 'contact') {
    require 'routes/contact.php';
} elseif ($section === 'admin') {
    require 'routes/admin.php';
}

sendJson(['error' => 'Адрес API не найден'], 404);
