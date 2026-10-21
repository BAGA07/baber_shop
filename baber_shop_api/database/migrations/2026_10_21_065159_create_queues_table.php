<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();

            $table->foreignId('salon_id')
                ->constrained('salons')
                ->cascadeOnDelete();

            $table->string('name')->default('File principale');

            $table->date('queue_date');

            $table->string('status')->default('open');
            // Valeurs prévues : open, paused, closed.

            $table->timestamps();

            $table->unique(
                ['salon_id', 'queue_date', 'name'],
                'queues_salon_date_name_unique'
            );

            $table->index(['salon_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
