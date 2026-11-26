<?php

if ($method === 'POST' && count($parts) === 1) {
    $data = readJson();
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $message = trim($data['message'] ?? '');

    if ($name === '') {
        sendJson(['error' => 'Введите имя'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['error' => 'Введите правильный email'], 400);
    }
    if (mb_strlen($message) < 10) {
        sendJson(['error' => 'Сообщение должно быть не короче 10 символов'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
    $stmt->execute([$name, $email, $message]);

    sendJson(['message' => 'Сообщение отправлено']);
}
