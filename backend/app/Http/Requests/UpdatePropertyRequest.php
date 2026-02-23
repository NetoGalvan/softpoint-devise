<?php

namespace App\Http\Requests;

class UpdatePropertyRequest extends StorePropertyRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * User must own the property to update it
     * Authorization check is done in controller using Policy
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * For update, all fields are optional but if present must follow same rules as creation
     */
    public function rules(): array
    {
        // Get parent rules
        $rules = parent::rules();

        foreach ($rules as $field => $fieldRules) {

            // Convertir reglas string a array
            if (is_string($fieldRules)) {
                $fieldRules = explode('|', $fieldRules);
            }

            // Quitar "required"
            $fieldRules = array_filter($fieldRules, function ($rule) {
                return $rule !== 'required';
            });

            // Agregar "sometimes"
            array_unshift($fieldRules, 'sometimes');

            $rules[$field] = $fieldRules;
        }

        return $rules;
    }
}
