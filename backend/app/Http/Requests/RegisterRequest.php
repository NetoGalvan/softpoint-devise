<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
     * - name: required, string, min 2 chars, max 255 chars
     * - email: required, valid email format, unique in users table
     * - password: required, min 8 chars, must be confirmed
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'min:2', 'max:255',
            ],
            'email' => [
                'required', 'string', 'email', 'max:255', 'unique:users,email',
            ],
            'password' => [
                'required', 'string', 'min:8', 'confirmed',
                Password::min(8)
                    ->mixedCase()   // mayúsculas y minúsculas
                    ->letters()     // letras obligatorias
                    ->numbers()     // al menos un número
                    ->symbols(),    // al menos un símbolo
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * Provides user-friendly error messages
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.min' => 'The name must be at least 2 characters.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'The password field is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'The password confirmation does not match.',
            'password.mixed' => 'The password must contain upper and lowercase letters.',
            'password.symbols' => 'The password must contain at least one symbol.',
        ];
    }
}
