<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Searching for admin user...\n";

$email = 'admin@maarrat-pharmacy.sy';
$password = 'password123';

try {
    $user = User::where('email', $email)->first();

    if (!$user) {
        echo "User not found. Creating new admin user...\n";
        $user = new User();
        $user->email = $email;
        $user->name = 'Admin';
    } else {
        echo "User found (ID: {$user->id}). Updating password...\n";
    }

    $user->password = Hash::make($password);
    $user->role = 'admin'; // Ensure role is admin
    $user->email_verified_at = now();
    $user->save();

    echo "\n----------------------------------------\n";
    echo "SUCCESS! Admin credentials updated:\n";
    echo "Email:    $email\n";
    echo "Password: $password\n";
    echo "Role:     {$user->role}\n";
    echo "----------------------------------------\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
