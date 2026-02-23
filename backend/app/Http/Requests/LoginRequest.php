<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Validation rules:
     * - email: required, valid email format
     * - password: required
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required', 'string', 'email',
            ],
            'password' => [
                'required', 'string',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * Generic messages for security
     */
    public function messages(): array
    {
        return [
            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
            'password.required' => 'The password field is required.',
        ];
    }
}
