<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$pharmacies = \App\Models\Pharmacy::all(['id', 'name', 'latitude', 'longitude', 'is_active']);

echo json_encode($pharmacies, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
