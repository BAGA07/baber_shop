<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue_entries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('queue_id')
                ->constrained('queues')
                ->cascadeOnDelete();

            $table->foreignId('salon_id')
                ->constrained('salons')
                ->cascadeOnDelete();

            $table->foreignId('service_id')
                ->constrained('services')
                ->restrictOnDelete();

            $table->foreignId('barber_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('client_name');
            $table->string('client_phone', 30);

            $table->unsignedInteger('position');

            // waiting, serving, completed, cancelled, no_show
            $table->string('status')->default('waiting');

            $table->unsignedSmallInteger('duration_minutes');
            $table->unsignedInteger('price');

            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index(['queue_id', 'status', 'position']);
            $table->index(['salon_id', 'client_phone']);
            $table->index(['barber_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_entries');
    }
};
