<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();

            $table->foreignId('salon_id')
                ->constrained('salons')
                ->cascadeOnDelete();

            $table->string('name');
            $table->text('description')->nullable();

            // Durée estimée de la prestation en minutes.
            $table->unsignedSmallInteger('duration_minutes');

            // Prix en francs CFA, sans décimales.
            $table->unsignedInteger('price');

            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['salon_id', 'name']);
            $table->index(['salon_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
