<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Database\Seeder;

class KeepOnlyTestPharmacySeeder extends Seeder
{
    public function run(): void
    {
        // حذف جميع الصيدليات ما عدا صيدلية الاختبار (user_id = 14)
        $pharmaciesToDelete = Pharmacy::where('user_id', '!=', 14)->get();
        
        echo "Deleting " . $pharmaciesToDelete->count() . " pharmacies...\n";
        
        foreach ($pharmaciesToDelete as $pharmacy) {
            $userId = $pharmacy->user_id;
            echo "Deleting pharmacy: {$pharmacy->name}\n";
            $pharmacy->delete();
            
            // حذف المستخدم المرتبط
            $user = User::find($userId);
            if ($user && $user->role === 'pharmacist') {
                echo "Deleting user: {$user->email}\n";
                $user->delete();
            }
        }

        echo "\n✅ Cleanup complete!\n";
        echo "Total pharmacies remaining: " . Pharmacy::count() . "\n";
        
        $testPharmacy = Pharmacy::where('user_id', 14)->first();
        if ($testPharmacy) {
            echo "\nRemaining pharmacy:\n";
            echo "- {$testPharmacy->name}\n";
            echo "- Email: pharmacist@test.com\n";
            echo "- Password: 123456\n";
        }
    }
}
