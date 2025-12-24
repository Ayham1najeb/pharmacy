<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DutyScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'duty_date' => $this->duty_date,
            'pharmacy' => [
                'id' => $this->pharmacy?->id,
                'name' => $this->pharmacy?->name,
                'owner_name' => $this->pharmacy?->owner_name,
                'address' => $this->pharmacy?->address,
                'phone' => $this->pharmacy?->phone,
                'latitude' => $this->pharmacy?->latitude,
                'longitude' => $this->pharmacy?->longitude,
                'neighborhood' => [
                    'id' => $this->pharmacy?->neighborhood?->id,
                    'name' => $this->pharmacy?->neighborhood?->name,
                ],
            ],
        ];
    }
}
