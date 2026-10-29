<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_templates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('service_category_id')
                ->constrained('service_categories')
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();

            $table->unsignedSmallInteger('default_duration_minutes')
                ->default(30);

            $table->unsignedInteger('suggested_price')
                ->default(0);

            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index([
                'service_category_id',
                'is_active',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_templates');
    }
};
