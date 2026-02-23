<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Property;
use App\Jobs\PropertyCreatedJob;

class PropertyController extends Controller
{

    /**
     * Display a listing of properties
     *
     * GET /api/properties
     *
     * Query parameters:
     * - type: filter by real_estate_type
     * - min_price: minimum price
     * - max_price: maximum price
     * - city: filter by city
     * - sort_by: field to sort by (price, created_at, name)
     * - sort_order: asc or desc
     * - per_page: items per page (default: 15)
     */
    public function index(Request $request)
    {
        // Start query for authenticated user's properties
        $query = Property::where('user_id', $request->user()->id)->active();

        // Apply filters
        if ($request->has('type')) {
            $query->where('real_estate_type', $request->type);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Apply sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        // Validate sort field to prevent SQL injection
        $allowedSorts = ['price', 'created_at', 'name', 'rooms', 'bathrooms'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginate results
        $perPage = $request->input('per_page', 15);
        $properties = $query->paginate($perPage);

        // Return paginated response
        return response()->json([
            'data' => $properties->items(),
            'meta' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ],
        ], 200);
    }


    // Store a newly created property - POST /api/properties
    public function store(StorePropertyRequest $request)
    {
        // Create property for authenticated user
        $property = Property::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'real_estate_type' => $request->real_estate_type,
            'street' => $request->street,
            'external_number' => $request->external_number,
            'internal_number' => $request->internal_number,
            'neighborhood' => $request->neighborhood,
            'city' => $request->city,
            'country' => $request->country,
            'rooms' => $request->rooms,
            'bathrooms' => $request->bathrooms,
            'price' => $request->price,
            'comments' => $request->comments,
        ]);

        // Dispatch job to send notification (runs in background)
        // This demonstrates queue usage as required by the challenge
        PropertyCreatedJob::dispatch($property);

        return response()->json([
            'message' => 'Property created successfully',
            'data' => $property,
        ], 201);
    }


    // Display the specified property -GET /api/properties/{id}
    public function show(Request $request, int $id)
    {
        // Look up the property and ensure it belongs to the authenticated user
        $property = $request->user()->properties()->active()->findOrFail($id);

        return response()->json([
            'data' => $property,
        ]);
    }


    // Update the specified property - PUT /api/properties/{id}
    public function update(UpdatePropertyRequest $request, int $id)
    {
        // Look up the property and ensure it belongs to the authenticated user
        $property = $request->user()->properties()->active()->findOrFail($id);

        if ($property) {
            // Update only fields that are present in the request
            $property->update($request->only([
                'name',
                'real_estate_type',
                'street',
                'external_number',
                'internal_number',
                'neighborhood',
                'city',
                'country',
                'rooms',
                'bathrooms',
                'price',
                'comments',
            ]));

            return response()->json([
                'message' => 'Property updated successfully',
                'data' => $property->fresh(), // fresh() reloads from database
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized to update this property',
            ], 403);
        }
    }


    // Remove the specified property - DELETE /api/properties/{id}
    public function destroy(Request $request, int $id)
    {
        // Look up the property and ensure it belongs to the authenticated user
        $property = $request->user()->properties()->active()->findOrFail($id);

        if ($property) {
            // Update only fields that are present in the request
            $property->deactivate();

            return response()->json([
                'message' => 'Property deleted successfully',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized to delete this property',
            ], 403);
        }
    }
}
