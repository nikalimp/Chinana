<?php
// Обработчик заявок chinana.ru (решение Ника 2026-11-10).
// 152-ФЗ: заявка сохраняется на хостинге в РФ (REG.RU) и уходит письмом на почту Оператора.
// В Telegram уходит только уведомление «Новая заявка №N» — без персональных данных.
// Настройки — в api/config.php, он лежит только на сервере и не попадает в репозиторий (см. config.example.php).

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

function reply(int $code, array $body): never {
  http_response_code($code);
  echo json_encode($body, JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'Только POST']);

$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) reply(500, ['ok' => false, 'error' => 'Форма временно не работает. Напишите нам в Telegram @chinana.']);
$cfg = require $cfgFile;

// Заявки — вне папки сайта, если хостинг позволяет; иначе папка закрыта .htaccess
$dir = $cfg['lead_dir'] ?? (dirname(__DIR__, 2) . '/chinana-leads');
if (!is_dir($dir) && !@mkdir($dir, 0700, true)) reply(500, ['ok' => false, 'error' => 'Не удалось сохранить заявку. Напишите нам в Telegram @chinana.']);

// Не чаще 5 заявок в час с одного адреса
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$rateFile = $dir . '/.rate-' . hash('sha256', $ip . ($cfg['salt'] ?? ''));
$times = array_filter(array_map('intval', @file($rateFile, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > time() - 3600);
if (count($times) >= 5) reply(429, ['ok' => false, 'error' => 'Слишком много заявок. Попробуйте через час или напишите в Telegram @chinana.']);

$in = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($in)) reply(400, ['ok' => false, 'error' => 'Пустая заявка']);

// Ловушка для ботов: скрытое поле должно остаться пустым
if (!empty($in['website'])) reply(200, ['ok' => true, 'id' => 0]);

$clean = fn($v, $max) => mb_substr(trim(preg_replace('/[\x00-\x1F\x7F]/u', ' ', (string)($v ?? ''))), 0, $max);
$lead = [
  'name'    => $clean($in['name'] ?? '', 80),
  'channel' => $clean($in['channel'] ?? '', 20),
  'contact' => $clean($in['contact'] ?? '', 80),
  'program' => $clean($in['program'] ?? '', 60),
  'page'    => $clean($in['page'] ?? '', 200),
];
$channels = ['telegram' => 'Telegram', 'whatsapp' => 'WhatsApp', 'phone' => 'Звонок'];
if (mb_strlen($lead['name']) < 2) reply(422, ['ok' => false, 'error' => 'Укажите имя']);
if (!isset($channels[$lead['channel']])) reply(422, ['ok' => false, 'error' => 'Выберите способ связи']);
if (mb_strlen($lead['contact']) < 3) reply(422, ['ok' => false, 'error' => 'Укажите телефон или ник в Telegram']);
if (($in['consent'] ?? false) !== true) reply(422, ['ok' => false, 'error' => 'Нужно согласие на обработку персональных данных']);

// Номер заявки и запись в файл (JSON Lines)
$counterFile = $dir . '/.counter';
$fp = fopen($counterFile, 'c+');
flock($fp, LOCK_EX);
$id = (int)stream_get_contents($fp) + 1;
ftruncate($fp, 0); rewind($fp); fwrite($fp, (string)$id); fflush($fp);
flock($fp, LOCK_UN); fclose($fp);

$record = ['id' => $id, 'at' => date('c'), 'consent' => true, 'consent_text' => 'Согласен на обработку персональных данных (https://chinana.ru/consent/)', 'ip' => $ip] + $lead;
file_put_contents($dir . '/leads-' . date('Y-m') . '.jsonl', json_encode($record, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
$times[] = time();
file_put_contents($rateFile, implode("\n", $times));

// Письмо Оператору
$to = $cfg['email_to'] ?? '';
$mailOk = false;
if ($to) {
  $subject = '=?UTF-8?B?' . base64_encode("Заявка №$id с chinana.ru") . '?=';
  $body = "Заявка №$id · " . date('d.m.Y H:i') . "\n\n"
    . "Имя: {$lead['name']}\n"
    . "Связаться: {$channels[$lead['channel']]} — {$lead['contact']}\n"
    . "Программа: " . ($lead['program'] ?: 'не выбрана') . "\n"
    . "Страница: {$lead['page']}\n\n"
    . "Согласие на обработку ПДн: да\n";
  $from = $cfg['email_from'] ?? 'noreply@chinana.ru';
  $headers = "From: Chinana <$from>\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit";
  $mailOk = @mail($to, $subject, $body, $headers, '-f' . $from);
}

// Уведомление в Telegram — без персональных данных
if (!empty($cfg['tg_token']) && !empty($cfg['tg_chat'])) {
  $ctx = stream_context_create(['http' => ['method' => 'POST', 'timeout' => 5, 'header' => 'Content-Type: application/json',
    'content' => json_encode(['chat_id' => $cfg['tg_chat'], 'text' => "Новая заявка №$id на chinana.ru — проверьте почту" . ($mailOk ? '' : ' (письмо не ушло, заявка сохранена на сервере)') . '.'], JSON_UNESCAPED_UNICODE)]]);
  @file_get_contents('https://api.telegram.org/bot' . $cfg['tg_token'] . '/sendMessage', false, $ctx);
}

reply(200, ['ok' => true, 'id' => $id]);
