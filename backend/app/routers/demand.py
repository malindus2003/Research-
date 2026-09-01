from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/demand", tags=["Component 1: AI Food Demand Prediction"])

MENU_ITEMS_FORECAST = [
    {
        "id": "menu-1",
        "name": "Sri Lankan Chicken Rice & Curry",
        "category": "Main Course",
        "current_stock": 45,
        "predicted_demand_today": 120,
        "prep_recommendation": 125,
        "buffer_quantity": 15,
        "price": 1200.0,
        "historical_avg": 95,
        "confidence": 94.2,
        "trend": "+26%",
        "key_drivers": ["Rainy afternoon forecast (+18%)", "Public Holiday Eve (+8%)"],
        "status": "Available"
    },
    {
        "id": "menu-2",
        "name": "Seafood Fried Rice (Jumbo)",
        "category": "Main Course",
        "current_stock": 20,
        "predicted_demand_today": 85,
        "prep_recommendation": 90,
        "buffer_quantity": 10,
        "price": 1850.0,
        "historical_avg": 70,
        "confidence": 91.5,
        "trend": "+21%",
        "key_drivers": ["Friday Dinner Rush", "Promotion Campaign 10% Off"],
        "status": "Available"
    },
    {
        "id": "menu-3",
        "name": "Cheese & Vegetable Kottu",
        "category": "Short Eats & Kottu",
        "current_stock": 15,
        "predicted_demand_today": 110,
        "prep_recommendation": 115,
        "buffer_quantity": 12,
        "price": 1400.0,
        "historical_avg": 88,
        "confidence": 96.0,
        "trend": "+25%",
        "key_drivers": ["Evening sports match live broadcast", "High reservation volume (42 pax)"],
        "status": "Available"
    },
    {
        "id": "menu-4",
        "name": "Creamy Tomato & Basil Pasta",
        "category": "Italian",
        "current_stock": 10,
        "predicted_demand_today": 45,
        "prep_recommendation": 50,
        "buffer_quantity": 5,
        "price": 1650.0,
        "historical_avg": 42,
        "confidence": 89.0,
        "trend": "+7%",
        "key_drivers": ["Stable weekday lunch demand"],
        "status": "Available"
    },
    {
        "id": "menu-5",
        "name": "Tropical Fruit Salad with Honey",
        "category": "Dessert",
        "current_stock": 8,
        "predicted_demand_today": 60,
        "prep_recommendation": 65,
        "buffer_quantity": 8,
        "price": 850.0,
        "historical_avg": 40,
        "confidence": 93.4,
        "trend": "+50%",
        "key_drivers": ["Overripe fruit batch inventory alert (FIFO priority push)"],
        "status": "Available"
    }
]

@router.get("/forecasts")
def get_demand_forecasts():
    """Retrieve item-level food demand forecasts and preparation guidelines."""
    today = datetime.now()
    multi_day_trend = []
    
    days = ["Mon", "Tue", "Wed", "Thu", "Fri (Today)", "Sat", "Sun"]
    predicted_totals = [310, 340, 365, 390, 480, 560, 520]
    actual_totals = [305, 348, 360, 385, None, None, None]

    for i in range(7):
        multi_day_trend.append({
            "day": days[i],
            "predicted_orders": predicted_totals[i],
            "actual_orders": actual_totals[i],
            "weather": "Thunderstorm" if i == 4 else ("Sunny" if i in [0, 1] else "Cloudy"),
            "event": "Weekend Rush" if i >= 4 else "Normal"
        })

    return {
        "researcher": "Nanayakkara K.A.J.Y (IT23314542)",
        "module": "Component 1: AI Food Demand Prediction",
        "model_performance": {
            "algorithm": "Hybrid Random Forest + Prophet Multi-Source Time-Series",
            "rmse": 4.12,
            "mae": 3.05,
            "mape": "4.8%",
            "training_window_days": 90
        },
        "contextual_factors": {
            "weather_condition": "Heavy Evening Rain (24°C)",
            "weather_impact": "+18% delivery & comfort food surge",
            "active_promotions": "10% Family Dinner Flash Deal",
            "reservations_booked": 64,
            "local_events": "Inter-University Rugby Match (Nearby Venue)",
            "seasonal_rush_periods": [
                {
                    "name": "Festive / Holiday Season",
                    "period": "December – Early January",
                    "description": "Christmas / New Year rush"
                },
                {
                    "name": "New Year / Spring Festival",
                    "period": "Mid-April",
                    "description": "Sinhala & Tamil New Year season"
                },
                {
                    "name": "Summer / Tourist Peak Season",
                    "period": "July – August",
                    "description": "Travel & vacation rush"
                }
            ]
        },
        "items": MENU_ITEMS_FORECAST,
        "multi_day_forecast": multi_day_trend
    }
