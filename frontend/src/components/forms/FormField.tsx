import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input } from '@/components/common';
import { Select, SelectOption } from './Select';
import { TextArea } from './TextArea';

/**
 * Field types
 */
type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';

/**
 * FormField props
 */
interface FormFieldProps {
  name: string;
  control: Control<any>;
  type?: FieldType;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[]; // For select type
  rows?: number; // For textarea type
  fullWidth?: boolean;
}

/**
 * FormField component
 * Wraps Input/Select/TextArea with react-hook-form Controller
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  control,
  type = 'text',
  label,
  placeholder,
  helperText,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  fullWidth = true,
}) => {
    return (
        <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
            // Render different components based on type
            switch (type) {
            case 'select':
                return (
                <Select
                    {...field}
                    label={label}
                    error={error?.message}
                    helperText={helperText}
                    options={options}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    fullWidth={fullWidth}
                />
                );

            case 'textarea':
                return (
                <TextArea
                    {...field}
                    label={label}
                    error={error?.message}
                    helperText={helperText}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    fullWidth={fullWidth}
                />
                );

            default:
                return (
                <Input
                    {...field}
                    type={type}
                    label={label}
                    error={error?.message}
                    helperText={helperText}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    fullWidth={fullWidth}
                />
                );
            }
        }}
        />
    );
};

export default FormField;