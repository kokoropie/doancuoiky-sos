<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->uuid('exam_id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration')->unsigned()->default(3600);
            $table->enum('status', ['draft', 'publish'])->default('draft');
            $table->json('questions')->nullable();
            $table->char('short_id', 10)->nullable()->unique();
            $table->boolean('editable')->default(true);
            $table->unsignedInteger('done_count')->default(0);
            $table->unsignedInteger('greater_5')->default(0);
            $table->foreignId('user_id')->references('user_id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
