<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .property-details {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #667eea;
            display: inline-block;
            width: 150px;
        }
        .value {
            color: #333;
        }
        .price {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 New Property Created!</h1>
    </div>

    <div class="content">
        <p>Hello <strong>{{ $property->user->name }}</strong>,</p>

        <p>Your property has been successfully registered in our system.</p>

        <div class="property-details">
            <h2 style="margin-top: 0; color: #667eea;">{{ $property->name }}</h2>

            <div class="price">
                ${{ number_format($property->price, 2) }}
            </div>

            <div class="detail-row">
                <span class="label">Type:</span>
                <span class="value">{{ ucwords(str_replace('_', ' ', $property->real_estate_type)) }}</span>
            </div>

            <div class="detail-row">
                <span class="label">Address:</span>
                <span class="value">
                    {{ $property->street }} {{ $property->external_number }}
                    @if($property->internal_number), {{ $property->internal_number }}@endif
                </span>
            </div>

            <div class="detail-row">
                <span class="label">City:</span>
                <span class="value">{{ $property->city }}, {{ $property->country }}</span>
            </div>

            <div class="detail-row">
                <span class="label">Neighborhood:</span>
                <span class="value">{{ $property->neighborhood }}</span>
            </div>

            <div class="detail-row">
                <span class="label">Rooms:</span>
                <span class="value">{{ $property->rooms }}</span>
            </div>

            <div class="detail-row">
                <span class="label">Bathrooms:</span>
                <span class="value">{{ $property->bathrooms }}</span>
            </div>

            @if($property->comments)
            <div class="detail-row">
                <span class="label">Comments:</span>
                <span class="value">{{ $property->comments }}</span>
            </div>
            @endif

            <div class="detail-row">
                <span class="label">Created:</span>
                <span class="value">{{ $property->created_at->format('F d, Y H:i') }}</span>
            </div>
        </div>

        <p style="margin-top: 30px;">
            Thank you for using Property Management!
        </p>
    </div>

    <div class="footer">
        <p>This is an automated notification. Please do not reply to this email.</p>
        <p>&copy; {{ date('Y') }} Property Management. All rights reserved.</p>
    </div>
</body>
</html>
