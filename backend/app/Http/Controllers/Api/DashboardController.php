<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     *
     * Returns:
     * - Total number of properties
     * - Average property price
     * - Properties grouped by type
     * - Recently added properties
    */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Total properties
        $totalProperties = Property::where('user_id', $userId)->count();

        $totalActiveProperties = Property::where('user_id', $userId)->active()->count();
        $totalInactiveProperties = Property::where('user_id', $userId)->inactive()->count();

        // Average price
        $averagePrice = Property::where('user_id', $userId)->avg('price') ?? 0;

        // Total value of all properties
        $totalValue = Property::where('user_id', $userId)->sum('price') ?? 0;

        // Properties by type
        $propertiesByType = Property::where('user_id', $userId)
            ->selectRaw('real_estate_type, COUNT(*) as count, AVG(price) as avg_price')
            ->groupBy('real_estate_type')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->real_estate_type,
                    'count' => $item->count,
                    'average_price' => round($item->avg_price, 2),
                ];
            });

        // Recently added properties (last 20)
        $recentProperties = Property::where('user_id', $userId)
            ->recent()
            ->take(5)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'name' => $property->name,
                    'type' => $property->real_estate_type,
                    'price' => $property->price,
                    'city' => $property->city,
                    'created_at' => $property->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'statistics' => [
                'total_properties' => $totalProperties,
                'total_active_properties' => $totalActiveProperties,
                'total_inactive_properties' => $totalInactiveProperties,
                'average_price' => round($averagePrice, 2),
                'total_value' => round($totalValue, 2),
            ],
            'properties_by_type' => $propertiesByType,
            'recent_properties' => $recentProperties,
        ], 200);
    }
}
