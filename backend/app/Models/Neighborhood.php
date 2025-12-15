<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Neighborhood extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'area_code',
    ];

    /**
     * Get the pharmacies for the neighborhood.
     */
    public function pharmacies(): HasMany
    {
        return $this->hasMany(Pharmacy::class);
    }

    /**
     * Get active pharmacies count.
     */
    public function getActivePharmaciesCountAttribute(): int
    {
        return $this->pharmacies()->where('is_active', true)->count();
    }
}
