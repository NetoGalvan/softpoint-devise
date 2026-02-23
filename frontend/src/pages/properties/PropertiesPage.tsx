import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaHome } from 'react-icons/fa';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Spinner, Badge, Modal } from '@/components/common';
import { Select } from '@/components/forms';
import { Input } from '@/components/common';
import { useToast } from '@/hooks';
import { propertiesApi } from '@/api';
import { formatCurrency, formatPropertyType, REAL_ESTATE_TYPE_OPTIONS, SORT_OPTIONS } from '@/utils';
import type { PropertyFilters, Property } from '@/types';

/**
 * PropertiesPage component
 */
export const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  // Filters
  const [filters, setFilters] = useState<PropertyFilters>({
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  /**
   * Fetch properties
   */
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await propertiesApi.getAll(filters, currentPage, 15);
      setProperties(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load properties on mount and when filters change
   */
  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (
    field: keyof PropertyFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Handle delete property
   */
  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await propertiesApi.delete(propertyToDelete.id);
      toast.success('Property deleted successfully');
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      fetchProperties(); // Reload list
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  /**
   * Open delete confirmation modal
   */
  const openDeleteModal = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-1">
              Manage your property portfolio
            </p>
          </div>
          <Link to="/properties/create">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FaFilter className="text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Type Filter */}
              <Select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                options={[
                  { value: '', label: 'All Types' },
                  ...REAL_ESTATE_TYPE_OPTIONS,
                ]}
                placeholder="Filter by type"
                fullWidth
              />

              {/* City Filter */}
              <Input
                type="text"
                placeholder="Filter by city"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                fullWidth
              />

              {/* Sort By */}
              <Select
                value={filters.sort_by || 'created_at'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                options={SORT_OPTIONS}
                fullWidth
              />

              {/* Sort Order */}
              <Select
                value={filters.sort_order || 'desc'}
                onChange={(e) =>
                  handleFilterChange('sort_order', e.target.value)
                }
                options={[
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' },
                ]}
                fullWidth
              />
            </div>
          </CardBody>
        </Card>

        {/* Properties List */}
        <Card>
          <CardBody>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No properties found</p>
                <Link to="/properties/create">
                  <Button variant="primary">
                    <FaPlus className="mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Property Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-1">
                              {property.name}
                            </h3>
                            <Badge variant="info">
                              {formatPropertyType(property.real_estate_type)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Property Body */}
                      <div className="p-4 space-y-3">
                        {/* Price */}
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(property.price)}
                          </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Location:</span>{' '}
                            {property.city}, {property.country}
                          </p>
                          <p>
                            <span className="font-medium">Address:</span>{' '}
                            {property.street} {property.external_number}
                            {property.internal_number &&
                              ` - ${property.internal_number}`}
                          </p>
                          <div className="flex space-x-4">
                            <span>
                              <span className="font-medium">Rooms:</span>{' '}
                              {property.rooms}
                            </span>
                            <span>
                              <span className="font-medium">Baths:</span>{' '}
                              {property.bathrooms}
                            </span>
                          </div>
                        </div>

                        {/* Comments */}
                        {property.comments && (
                          <p className="text-sm text-gray-500 italic">
                            "{property.comments}"
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2 pt-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/properties/${property.id}/edit`)
                            }
                            className="flex-1"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openDeleteModal(property)}
                            className="flex-1"
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Property"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{propertyToDelete?.name}</span>?
            This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default PropertiesPage;