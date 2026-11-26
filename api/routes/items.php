<?php

$select = 'SELECT items.id, items.user_id, items.title, items.author, items.year, items.description, users.name AS owner_name
           FROM items JOIN users ON users.id = items.user_id';

if ($method === 'GET' && count($parts) === 1) {
    if (isset($_GET['limit'])) {
        $stmt = $pdo->prepare($select . ' ORDER BY items.id DESC LIMIT ?');
        $stmt->bindValue(1, (int)$_GET['limit'], PDO::PARAM_INT);
        $stmt->execute();
    } else {
        $stmt = $pdo->prepare($select . ' ORDER BY items.id DESC');
        $stmt->execute();
    }

    sendJson($stmt->fetchAll());
}

if ($method === 'GET' && count($parts) === 2) {
    $stmt = $pdo->prepare($select . ' WHERE items.id = ?');
    $stmt->execute([(int)$parts[1]]);
    $item = $stmt->fetch();

    if (!$item) {
        sendJson(['error' => 'Книга не найдена'], 404);
    }

    sendJson($item);
}
