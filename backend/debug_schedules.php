<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Checking schedules...\n";
$today = now()->toDateString();
echo "Today is: " . $today . "\n";

$count = \App\Models\DutySchedule::whereDate('duty_date', '>=', $today)->count();
echo "Total future schedules: " . $count . "\n";

$schedules = \App\Models\DutySchedule::whereDate('duty_date', '>=', $today)
    ->with('pharmacy')
    ->orderBy('duty_date', 'asc')
    ->get();

foreach ($schedules as $s) {
    echo "ID: {$s->id} | Date: {$s->duty_date} | Shift: {$s->shift_type} | Pharmacy: " . ($s->pharmacy ? $s->pharmacy->name : 'NULL') . " | Image: " . ($s->pharmacy ? $s->pharmacy->image_path : 'NULL') . "\n";
}
