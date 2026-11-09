<?php
/**
 * ticker.php - server-side proxy for the rack's live ticker.
 *
 * The browser cannot fetch a third-party leaderboard directly (CORS), so this
 * endpoint fetches it server-side, extracts the ranked entries, and serves a
 * tiny JSON feed with a 30-minute cache.
 *
 * Point $TICKER_URL at any page whose markup contains either:
 *   - JSON-LD ItemList entries:  "position":1,"name":"Someone"
 *   - or adapt the regex below to your source page.
 *
 * Response: {"items":["#1 SOMEONE 61,000 MI", ...], "ts": 1700000000}
 */

$TICKER_URL = 'https://example.com/leaderboard';   // your data source
$CACHE_FILE = __DIR__ . '/.ticker-cache.json';
$CACHE_TTL  = 1800;                                // 30 minutes

header('Content-Type: application/json; charset=utf-8');
if (is_file($CACHE_FILE) && time() - filemtime($CACHE_FILE) < $CACHE_TTL) {
    echo file_get_contents($CACHE_FILE);
    exit;
}

$html = @file_get_contents($TICKER_URL);
if ($html === false) {
    header('HTTP/1.1 502 Bad Gateway');
    echo json_encode(array('items' => array(), 'error' => 'upstream fetch failed'));
    exit;
}

$items = array();
$names = array();
$miles = array();

// ranked names (JSON-LD ItemList order)
if (preg_match_all('/"position":(\d+),"name":"([^"]+)"/', $html, $m)) {
    for ($i = 0; $i < count($m[0]); $i++) {
        if ((int)$m[1][$i] >= 1 && (int)$m[1][$i] <= 5) $names[(int)$m[1][$i]] = $m[2][$i];
    }
}

// optional numeric value per entry (here: miles) found after each name's link
for ($i = 1; $i <= 5; $i++) {
    if (!isset($names[$i])) continue;
    $p = strpos($html, $names[$i] . '</a>');
    if ($p !== false && preg_match('/<span[^>]*>\s*([0-9]{1,2},[0-9]{3})\s*mi/i', substr($html, $p, 300), $mm)) {
        $miles[$i] = $mm[1];
    }
    if (isset($names[$i])) {
        $items[] = '#' . $i . ' ' . strtoupper($names[$i]) . (isset($miles[$i]) ? ' ' . $miles[$i] . ' MI' : '');
    }
}

if (!count($items)) { $items = array('LIVE LEADERBOARD - edit ticker.php to point at your source'); }
array_unshift($items, "The DJ Calendar top 5 DJ's worldwide"); // leading label - or your own

$out = json_encode(array('items' => $items, 'ts' => time()));
file_put_contents($CACHE_FILE, $out);
echo $out;
