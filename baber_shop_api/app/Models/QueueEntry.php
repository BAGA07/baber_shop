<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QueueEntry extends Model
{
    protected $fillable = [
        'queue_id',
        'salon_id',
        'service_id',
        'barber_id',
        'client_name',
        'client_phone',
        'position',
        'status',
        'duration_minutes',
        'price',
        'joined_at',
        'started_at',
        'completed_at',
        'tracking_token_hash',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'duration_minutes' => 'integer',
            'price' => 'integer',
            'joined_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function queue(): BelongsTo
    {
        return $this->belongsTo(Queue::class);
    }

    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function barber(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barber_id');
    }
}
