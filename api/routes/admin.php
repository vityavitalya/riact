<?php

requireAdmin($pdo);

$what = $parts[1] ?? '';
$id = (int)($parts[2] ?? 0);

if ($method === 'GET' && $what === 'users') {
    $stmt = $pdo->prepare('SELECT users.id, users.name, users.email, users.role,
                                  DATE_FORMAT(users.created_at, "%d.%m.%Y") AS created_at,
                                  COUNT(items.id) AS items_count
                           FROM users LEFT JOIN items ON items.user_id = users.id
                           GROUP BY users.id
                           ORDER BY users.id');
    $stmt->execute();
    sendJson($stmt->fetchAll());
}

if ($method === 'DELETE' && $what === 'items' && $id > 0) {
    $stmt = $pdo->prepare('DELETE FROM items WHERE id = ?');
    $stmt->execute([$id]);
    sendJson(['message' => 'Книга удалена']);
}

if ($method === 'GET' && $what === 'contacts') {
    $stmt = $pdo->prepare('SELECT id, name, email, message,
                                  DATE_FORMAT(created_at, "%d.%m.%Y %H:%i") AS created_at
                           FROM contacts ORDER BY id DESC');
    $stmt->execute();
    sendJson($stmt->fetchAll());
}
