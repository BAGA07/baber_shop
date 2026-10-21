<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('salon_id')
                ->nullable()
                ->after('id')
                ->constrained('salons')
                ->nullOnDelete();

            $table->string('role')->default('coiffeur');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('salon_id');
            $table->dropColumn('role');
        });
    }
};
