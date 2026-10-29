<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('service_template_id')
                ->nullable()
                ->constrained('service_templates')
                ->nullOnDelete();

            $table->string('image_path')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropConstrainedForeignId('service_template_id');
            $table->dropColumn('image_path');
        });
    }
};
