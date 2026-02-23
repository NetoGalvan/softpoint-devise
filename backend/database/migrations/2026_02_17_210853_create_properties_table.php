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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            // Property details
            $table->string('name', 128)->comment('Property name - max 128 characters');
            $table->enum('real_estate_type', ['house', 'apartment', 'land', 'commercial_ground'])->comment('Type of real estate property');
            // Address
            $table->string('street', 128)->comment('Street name');
            $table->string('external_number', 12)->comment('External number - alphanumeric and dash');
            $table->string('internal_number', 12)->nullable()->comment('Internal number - required for apartments and commercial grounds');
            $table->string('neighborhood', 128)->comment('Neighborhood or colony name');
            $table->string('city', 64)->comment('City name');
            $table->char('country', 2)->comment('ISO 3166 Alpha-2 country code (2 letters)');
            // Property characteristics
            $table->unsignedInteger('rooms')->default(0)->comment('Number of rooms - must be >= 0');
            $table->decimal('bathrooms', 3, 1)->default(0)->comment('Number of bathrooms - can be decimal (e.g., 2.5)');
            $table->decimal('price', 12, 2)->comment('Property price - must be positive');
            $table->text('comments')->nullable()->comment('Optional comments about the property - max 128 chars');
            $table->boolean('status')->default(true)->comment('Indicates if the record is active');
            // Timestamps
            $table->timestamps();

            // Foreign key to users table
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->comment('Owner of the property');

            // Indexes for improve database performance by speeding up searches, filters, and sorting on commonly queried columns.
            $table->index('user_id');
            $table->index('real_estate_type');
            $table->index('price');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
