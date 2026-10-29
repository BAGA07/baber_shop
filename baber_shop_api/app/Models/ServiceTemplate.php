<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceTemplate extends Model
{
    protected $fillable = [
        'service_category_id',
        'name',
        'slug',
        'description',
        'image_path',
        'default_duration_minutes',
        'suggested_price',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'default_duration_minutes' => 'integer',
            'suggested_price' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'service_template_id');
    }
}
