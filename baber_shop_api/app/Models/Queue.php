<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Queue extends Model
{
    protected $fillable = [
        'salon_id',
        'name',
        'queue_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'queue_date' => 'date',
        ];
    }

    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(QueueEntry::class);
    }
}
