<?php

$user = requireUser($pdo);
$userId = $user['id'];

$what = $parts[1] ?? '';
$id = (int)($parts[2] ?? 0);

function validateItem($data)
{
    $title = trim($data['title'] ?? '');
    $author = trim($data['author'] ?? '');
    $year = (int)($data['year'] ?? 0);
    $description = trim($data['description'] ?? '');

    if ($title === '') {
        sendJson(['error' => 'Введите название книги'], 400);
    }
    if ($author === '') {
        sendJson(['error' => 'Введите автора'], 400);
    }
    if ($year < 1 || $year > (int)date('Y')) {
        sendJson(['error' => 'Год должен быть от 1 до ' . date('Y')], 400);
    }
    if (mb_strlen($title) > 200 || mb_strlen($author) > 100) {
        sendJson(['error' => 'Слишком длинное название или имя автора'], 400);
    }

    return [$title, $author, $year, $description];
}

function findMyItem($pdo, $id, $userId)
{
    $stmt = $pdo->prepare('SELECT id, title, author, year, description FROM items WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);
    $item = $stmt->fetch();

    if (!$item) {
        sendJson(['error' => 'Книга не найдена или она не ваша'], 404);
    }

    return $item;
}

if ($method === 'GET' && $what === 'summary') {
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM items WHERE user_id = ?');
    $stmt->execute([$userId]);

    sendJson(['name' => $user['name'], 'count' => (int)$stmt->fetchColumn()]);
}

if ($method === 'GET' && $what === 'items' && $id === 0) {
    $stmt = $pdo->prepare('SELECT id, title, author, year, description FROM items WHERE user_id = ? ORDER BY id DESC');
    $stmt->execute([$userId]);

    sendJson($stmt->fetchAll());
}

if ($method === 'GET' && $what === 'items' && $id > 0) {
    sendJson(findMyItem($pdo, $id, $userId));
}

if ($method === 'POST' && $what === 'items') {
    [$title, $author, $year, $description] = validateItem(readJson());

    $stmt = $pdo->prepare('INSERT INTO items (user_id, title, author, year, description) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $title, $author, $year, $description]);

    sendJson(['message' => 'Книга добавлена', 'id' => (int)$pdo->lastInsertId()]);
}

if ($method === 'PUT' && $what === 'items' && $id > 0) {
    findMyItem($pdo, $id, $userId);
    [$title, $author, $year, $description] = validateItem(readJson());

    $stmt = $pdo->prepare('UPDATE items SET title = ?, author = ?, year = ?, description = ? WHERE id = ? AND user_id = ?');
    $stmt->execute([$title, $author, $year, $description, $id, $userId]);

    sendJson(['message' => 'Книга сохранена']);
}

if ($method === 'DELETE' && $what === 'items' && $id > 0) {
    findMyItem($pdo, $id, $userId);

    $stmt = $pdo->prepare('DELETE FROM items WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);

    sendJson(['message' => 'Книга удалена']);
}

if ($method === 'GET' && $what === 'profile') {
    $stmt = $pdo->prepare('SELECT name, email, role, DATE_FORMAT(created_at, "%d.%m.%Y") AS created_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);

    sendJson($stmt->fetch());
}

if ($method === 'PUT' && $what === 'profile') {
    $data = readJson();
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');

    if ($name === '') {
        sendJson(['error' => 'Введите имя'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['error' => 'Введите правильный email'], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
    $stmt->execute([$email, $userId]);
    if ($stmt->fetch()) {
        sendJson(['error' => 'Такой email уже занят'], 400);
    }

    $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    $stmt->execute([$name, $email, $userId]);

    sendJson(['message' => 'Профиль сохранён', 'user' => currentUser($pdo)]);
}

if ($method === 'POST' && $what === 'change-password') {
    $data = readJson();
    $oldPassword = $data['oldPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';
    $confirm = $data['confirmPassword'] ?? '';

    $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $hash = $stmt->fetchColumn();

    if (!password_verify($oldPassword, $hash)) {
        sendJson(['error' => 'Старый пароль неверный'], 400);
    }
    if (strlen($newPassword) < 6) {
        sendJson(['error' => 'Новый пароль должен быть не короче 6 символов'], 400);
    }
    if ($newPassword !== $confirm) {
        sendJson(['error' => 'Пароли не совпадают'], 400);
    }

    $stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $stmt->execute([password_hash($newPassword, PASSWORD_DEFAULT), $userId]);

    sendJson(['message' => 'Пароль изменён']);
}
