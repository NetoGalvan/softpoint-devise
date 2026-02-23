<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Property;
use App\Mail\PropertyCreatedMail;
use Illuminate\Support\Facades\Mail;

class PropertyCreatedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(public Property $property) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Load property owner
        $this->property->load('user');

        // Log notification (in production, send real email)
        Log::info('Property created notification', [
            'property_id' => $this->property->id,
            'property_name' => $this->property->name,
            'owner_email' => $this->property->user->email,
            'owner_name' => $this->property->user->name,
        ]);

        // Intentar enviar correo solo si está configurado
        if ($this->isMailConfigured()) {
            try {
                Mail::to($this->property->user->email)
                    ->send(new PropertyCreatedMail($this->property));

                Log::info('Email sent successfully', [
                    'property_id' => $this->property->id,
                    'recipient' => $this->property->user->email,
                ]);
            } catch (\Exception $e) {
                // Log error but don't fail the job
                Log::warning('Failed to send email, but job continues', [
                    'property_id' => $this->property->id,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::info('Mail not configured, skipping email notification', [
                'property_id' => $this->property->id,
            ]);
        }

        Log::info('Property notification job completed', [
            'property_id' => $this->property->id,
        ]);
    }

    /**
     * Check if mail is properly configured
     */
    private function isMailConfigured(): bool
    {
        $mailer = config('mail.default');
        $host = config('mail.mailers.' . $mailer . '.host');
        $username = config('mail.mailers.' . $mailer . '.username');

        // Verificar que hay configuración básica
        return !empty($host) && !empty($username);
    }

    /**
     * Handle job failure
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Property notification failed', [
            'property_id' => $this->property->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
