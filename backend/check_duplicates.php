<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$pharmacies = \App\Models\Pharmacy::all();
$coords = [];
$duplicates = [];

foreach ($pharmacies as $p) {
    if (!$p->latitude || !$p->longitude) {
        echo "Pharmacy {$p->name} (ID: {$p->id}) has missing coordinates.\n";
        continue;
    }
    
    $key = $p->latitude . ',' . $p->longitude;
    if (isset($coords[$key])) {
        $duplicates[] = [
            'original' => $coords[$key],
            'duplicate' => $p->name . ' (ID: ' . $p->id . ')'
        ];
    } else {
        $coords[$key] = $p->name . ' (ID: ' . $p->id . ')';
    }
}

if (empty($duplicates)) {
    echo "No exact duplicate coordinates found.\n";
} else {
    echo "Found duplicates:\n";
    foreach ($duplicates as $d) {
        echo "- {$d['duplicate']} overlaps with {$d['original']}\n";
    }
}

echo "Total Pharmacies: " . $pharmacies->count() . "\n";
