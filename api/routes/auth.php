<?php

$action = $parts[1] ?? '';

if ($method === 'POST' && $action === 'register') {
    $data = readJson();
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $confirm = $data['confirmPassword'] ?? '';

    if ($name === '') {
        sendJson(['error' => 'Введите имя'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['error' => 'Введите правильный email'], 400);
    }
    if (strlen($password) < 6) {
        sendJson(['error' => 'Пароль должен быть не короче 6 символов'], 400);
    }
    if ($password !== $confirm) {
        sendJson(['error' => 'Пароли не совпадают'], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendJson(['error' => 'Такой email уже зарегистрирован'], 400);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $hash, 'User']);

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$pdo->lastInsertId();

    sendJson(['user' => currentUser($pdo)]);
}

if ($method === 'POST' && $action === 'login') {
    $data = readJson();
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if ($email === '' || $password === '') {
        sendJson(['error' => 'Введите email и пароль'], 400);
    }

    $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($password, $row['password_hash'])) {
        sendJson(['error' => 'Неверный email или пароль'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = $row['id'];

    sendJson(['user' => currentUser($pdo)]);
}

if ($method === 'POST' && $action === 'logout') {
    $_SESSION = [];
    session_destroy();

    sendJson(['message' => 'Вы вышли']);
}

if ($method === 'GET' && $action === 'me') {
    sendJson(['user' => currentUser($pdo)]);
}
