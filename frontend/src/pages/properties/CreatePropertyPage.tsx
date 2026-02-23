import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Input } from '@/components/common';
import { Select, TextArea } from '@/components/forms';
import { useToast } from '@/hooks';
import { propertiesApi } from '@/api';
import { REAL_ESTATE_TYPE_OPTIONS, COUNTRY_OPTIONS } from '@/utils';
import { propertySchema, PropertyFormData } from './schemas';
import type { ApiError } from '@/types';

/**
 * CreatePropertyPage component
 */
export const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      real_estate_type: 'house',
      rooms: 0,
      bathrooms: 0,
      price: 0,
      country: 'US',
    },
  });

  // Watch property type for conditional fields
  const propertyType = watch('real_estate_type');

  /**
   * Handle form submission
   */
  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);

      // Convert empty strings to undefined for optional fields
      const cleanData = {
        ...data,
        internal_number: data.internal_number || undefined,
        comments: data.comments || undefined,
      };

      await propertiesApi.create(cleanData);

      toast.success('Property created successfully!');
      navigate('/properties');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Failed to create property');

      // Show validation errors
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Property
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new property to your portfolio
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline">
              <FaArrowLeft className="mr-2" />
              Back to List
            </Button>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Property Details
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <Input
                    {...register('name')}
                    label="Property Name"
                    placeholder="e.g., Downtown Apartment"
                    error={errors.name?.message}
                    required
                    fullWidth
                  />

                  {/* Type */}
                  <Select
                    {...register('real_estate_type')}
                    label="Property Type"
                    options={REAL_ESTATE_TYPE_OPTIONS}
                    error={errors.real_estate_type?.message}
                    required
                    fullWidth
                  />
                </div>

                {/* Address Section */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Street */}
                    <Input
                      {...register('street')}
                      label="Street"
                      placeholder="e.g., Main Street"
                      error={errors.street?.message}
                      required
                      fullWidth
                    />

                    {/* External Number */}
                    <Input
                      {...register('external_number')}
                      label="External Number"
                      placeholder="e.g., 123"
                      error={errors.external_number?.message}
                      required
                      fullWidth
                    />

                    {/* Internal Number (Optional) */}
                    <Input
                      {...register('internal_number')}
                      label="Internal Number"
                      placeholder="e.g., Apt 4B (optional)"
                      error={errors.internal_number?.message}
                      fullWidth
                    />

                    {/* Neighborhood */}
                    <Input
                      {...register('neighborhood')}
                      label="Neighborhood"
                      placeholder="e.g., Downtown"
                      error={errors.neighborhood?.message}
                      required
                      fullWidth
                    />

                    {/* City */}
                    <Input
                      {...register('city')}
                      label="City"
                      placeholder="e.g., New York"
                      error={errors.city?.message}
                      required
                      fullWidth
                    />

                    {/* Country */}
                    <Select
                      {...register('country')}
                      label="Country"
                      options={COUNTRY_OPTIONS}
                      error={errors.country?.message}
                      required
                      fullWidth
                    />
                  </div>
                </div>

                {/* Property Features */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Rooms */}
                    <Input
                      {...register('rooms', { valueAsNumber: true })}
                      type="number"
                      label="Rooms"
                      placeholder="0"
                      error={errors.rooms?.message}
                      required
                      fullWidth
                      min="0"
                    />

                    {/* Bathrooms */}
                    <Input
                      {...register('bathrooms', { valueAsNumber: true })}
                      type="number"
                      label="Bathrooms"
                      placeholder="0"
                      error={errors.bathrooms?.message}
                      fullWidth
                      min="0"
                      step="0.5"
                    />

                    {/* Price */}
                    <Input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      label="Price (USD)"
                      placeholder="0.00"
                      error={errors.price?.message}
                      required
                      fullWidth
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <TextArea
                    {...register('comments')}
                    label="Comments"
                    placeholder="Any additional notes about the property (optional)"
                    error={errors.comments?.message}
                    rows={4}
                    fullWidth
                  />
                </div>

                {/* Info Message for Land/Commercial */}
                {(propertyType === 'land' ||
                  propertyType === 'commercial_ground') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> For {propertyType === 'land' ? 'land' : 'commercial ground'} properties,
                      internal number and bathrooms are optional and will default to appropriate values.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Link to="/properties">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    <FaSave className="mr-2" />
                    Create Property
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreatePropertyPage;