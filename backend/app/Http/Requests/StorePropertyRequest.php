<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Property;
use Illuminate\Validation\Rule;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * User must be authenticated to create properties
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Only authenticated users can create properties
        return $this->user() !== null;
    }

    /**
     * Prepare the data for validation.
     *
     * Called before validation runs
     * Used to clean/normalize data
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->name ? trim($this->name) : $this->name,
            'street' => $this->street ? trim($this->street) : $this->street,
            'country' => $this->country ? strtoupper(trim($this->country)) : $this->country,
            'external_number' => $this->external_number ? trim($this->external_number) : $this->external_number,
            'internal_number' => $this->internal_number ? trim($this->internal_number) : $this->internal_number,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Implements all rules from Property Entity specification:
     * - Field length limits
     * - Format requirements (alphanumeric, ISO codes)
     * - Conditional requirements (internal_number, bathrooms)
     * - Range validations (price, rooms)
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'max:128',
            ],
            // Real estate type - must be one of allowed values
            'real_estate_type' => [
                'required', 'string', Rule::in(Property::TYPES),
            ],
            'street' => [
                'required', 'string', 'max:128',
            ],
            'external_number' => [
                'required', 'string', 'max:12', 'regex:/^[a-zA-Z0-9-]+$/',
            ],
            // Required if type is apartment or commercial_ground
            'internal_number' => [
                'nullable', 'string', 'max:12', 'regex:/^[a-zA-Z0-9\s-]+$/',
                Rule::requiredIf(function () {
                    return in_array($this->real_estate_type, Property::TYPES_REQUIRING_INTERNAL_NUMBER);
                }),
            ],
            'neighborhood' => [
                'required', 'string', 'max:128',
            ],
            'city' => [
                'required', 'string', 'max:64',
            ],
            'country' => [
                'required', 'string', 'size:2', 'regex:/^[A-Z]{2}$/',
            ],
            'rooms' => [
                'required', 'integer', 'min:0',
            ],
            // Can be 0 only for land or commercial_ground
            'bathrooms' => [
                'required', 'numeric', 'min:0', 'regex:/^\d+(\.\d)?$/',  // Allows format: 0, 1, 1.5, 2, 2.5
                function ($attribute, $value, $fail) {
                    // Custom validation: bathrooms must be >= 1 unless specific types
                    $allowsZero = in_array(
                        $this->real_estate_type,
                        Property::TYPES_ALLOWING_ZERO_BATHROOMS
                    );

                    if (!$allowsZero && $value < 1) {
                        $fail('The bathrooms must be at least 1 for this property type.');
                    }
                },
            ],
            'price' => [
                'required', 'numeric', 'min:0.01', 'regex:/^\d+(\.\d{1,2})?$/',  // Max 2 decimal places
            ],
            'comments' => [
                'nullable', 'string', 'max:128',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The property name is required.',
            'name.max' => 'The property name cannot exceed 128 characters.',

            'real_estate_type.required' => 'Please select a property type.',
            'real_estate_type.in' => 'Invalid property type selected.',

            'street.required' => 'The street name is required.',
            'street.max' => 'The street name cannot exceed 128 characters.',

            'external_number.required' => 'The external number is required.',
            'external_number.max' => 'The external number cannot exceed 12 characters.',
            'external_number.regex' => 'The external number can only contain letters, numbers, and dashes.',

            'internal_number.required_if' => 'The internal number is required for apartments and commercial grounds.',
            'internal_number.max' => 'The internal number cannot exceed 12 characters.',
            'internal_number.regex' => 'The internal number can only contain letters, numbers, dashes, and spaces.',

            'neighborhood.required' => 'The neighborhood is required.',
            'neighborhood.max' => 'The neighborhood cannot exceed 128 characters.',

            'city.required' => 'The city is required.',
            'city.max' => 'The city cannot exceed 64 characters.',

            'country.required' => 'The country code is required.',
            'country.size' => 'The country code must be exactly 2 characters (ISO 3166 Alpha-2).',
            'country.regex' => 'The country code must be 2 uppercase letters (e.g., US, MX, CA).',

            'rooms.required' => 'The number of rooms is required.',
            'rooms.integer' => 'The number of rooms must be a whole number.',
            'rooms.min' => 'The number of rooms cannot be negative.',

            'bathrooms.required' => 'The number of bathrooms is required.',
            'bathrooms.numeric' => 'The number of bathrooms must be a number.',
            'bathrooms.min' => 'The number of bathrooms cannot be negative.',
            'bathrooms.regex' => 'The bathrooms format is invalid (e.g., 1, 1.5, 2).',

            'price.required' => 'The price is required.',
            'price.numeric' => 'The price must be a valid number.',
            'price.min' => 'The price must be greater than 0.',
            'price.regex' => 'The price format is invalid (max 2 decimal places).',

            'comments.max' => 'Comments cannot exceed 128 characters.',
        ];
    }

    /**
     * Get custom attribute names for error messages.
     *
     * Makes error messages more readable
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'real_estate_type' => 'property type',
            'external_number' => 'external number',
            'internal_number' => 'internal number',
        ];
    }
}
