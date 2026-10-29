<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'salon_id',
        'name',
        'description',
        'duration_minutes',
        'price',
        'is_active',
        'service_template_id',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'price' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ServiceTemplate::class, 'service_template_id');
    }
}
