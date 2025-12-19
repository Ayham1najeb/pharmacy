<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$maher = \App\Models\Pharmacy::where('name', 'LIKE', '%ماهر%')->first();
$count = \App\Models\Pharmacy::active()->count();

echo json_encode([
    'maher_exists' => (bool)$maher,
    'maher_lat' => $maher ? $maher->latitude : null,
    'maher_lng' => $maher ? $maher->longitude : null,
    'total_active' => $count
], JSON_PRETTY_PRINT);
