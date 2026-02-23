import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaHome, FaDollarSign, FaChartLine, FaPlus } from 'react-icons/fa';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Spinner, Button, Badge } from '@/components/common';
import { useApi, useToast } from '@/hooks';
import { dashboardApi } from '@/api';
import { formatCurrency, formatRelativeTime } from '@/utils';
import type { DashboardResponse } from '@/types';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * DashboardPage component
 */
export const DashboardPage: React.FC = () => {
  const toast = useToast();
  const { data, loading, error, execute } = useApi<DashboardResponse | undefined>(
    dashboardApi.getStats
  );
  const [stats, setStats] = useState(data);

  /**
   * Fetch dashboard data on mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await execute();
        setStats(result);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, []);

  /**
   * Prepare chart data
   */
  const chartData = stats
    ? {
        labels: stats.properties_by_type.map(
          (item) => item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')
        ),
        datasets: [
          {
            data: stats.properties_by_type.map((item) => item.count),
            backgroundColor: [
              '#3B82F6', // Blue
              '#10B981', // Green
              '#F59E0B', // Amber
              '#8B5CF6', // Purple
            ],
            borderWidth: 0,
          },
        ],
      }
    : null;

  /**
   * Chart options
   */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Overview of your property portfolio
            </p>
          </div>
          <Link to="/properties/create">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Properties */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Properties
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.statistics.total_properties}
                  </p>

                  {/* Sección de Activas e Inactivas en pequeño */}
                  <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Active:</span> {stats.statistics.total_active_properties || 0}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Inactive:</span> {stats.statistics.total_inactive_properties || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center self-start">
                  <FaHome className="text-2xl text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Average Price */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Price
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.statistics.average_price)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="text-2xl text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Total Value */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Portfolio Value
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.statistics.total_value)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-2xl text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Properties by Type Chart */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Properties by Type
              </h2>
            </CardHeader>
            <CardBody>
              {chartData && (
                <div className="h-64">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              )}
              <div className="mt-4 space-y-2">
                {stats.properties_by_type.map((item) => (
                  <div
                    key={item.type}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">
                        {item.count} properties
                      </span>
                      <span className="text-gray-500">
                        {formatCurrency(item.average_price)} avg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Recent Properties */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Properties
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {stats.recent_properties.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No properties yet
                  </p>
                ) : (
                  stats.recent_properties.map((property) => (
                    <Link
                      key={property.id}
                      to={`/properties/${property.id}/edit`}
                      className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {property.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {property.city}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="info">
                            {property.type.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatCurrency(property.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatRelativeTime(property.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;