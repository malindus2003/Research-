from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api/waste", tags=["Component 4: IoT Smart Waste Bin & Categorization"])

SMART_BIN_COMPARTMENTS = [
    {
        "id": "comp-1",
        "name": "Food Waste Compartment (Organic)",
        "fill_level_percent": 78.5,
        "current_weight_kg": 18.2,
        "capacity_kg": 25.0,
        "ultrasonic_distance_cm": 8.5,
        "status": "warning",
        "frequent_items": ["Leftover Cooked Rice (6.2 kg)", "Vegetable Peelings (4.8 kg)", "Chicken Bones (3.5 kg)", "Plate Scraps (3.7 kg)"],
        "cost_loss_today": "LKR 7,450.00"
    },
    {
        "id": "comp-2",
        "name": "Recyclable Plastics & Polythene",
        "fill_level_percent": 42.0,
        "current_weight_kg": 4.1,
        "capacity_kg": 12.0,
        "ultrasonic_distance_cm": 22.0,
        "status": "optimal",
        "frequent_items": ["Food takeaway containers", "Sauce bottles", "Stretch wrap"],
        "cost_loss_today": "LKR 450.00"
    },
    {
        "id": "comp-3",
        "name": "Paper & Cardboard Packaging",
        "fill_level_percent": 35.0,
        "current_weight_kg": 3.8,
        "capacity_kg": 15.0,
        "ultrasonic_distance_cm": 28.0,
        "status": "optimal",
        "frequent_items": ["Egg cartons", "Dry grocery boxes", "Paper napkins"],
        "cost_loss_today": "LKR 280.00"
    },
    {
        "id": "comp-4",
        "name": "General Non-Recyclable Waste",
        "fill_level_percent": 28.0,
        "current_weight_kg": 2.4,
        "capacity_kg": 12.0,
        "ultrasonic_distance_cm": 32.0,
        "status": "optimal",
        "frequent_items": ["Waxed wrappers", "Miscellaneous packaging"],
        "cost_loss_today": "LKR 120.00"
    }
]

WASTE_COMPOSITION = [
    {"category": "Leftover Rice & Grains", "weight_kg": 7.4, "percentage": 34.5, "cost_rs": 2800, "color": "#f59e0b"},
    {"category": "Vegetable Cuttings & Trimmings", "weight_kg": 5.2, "percentage": 24.2, "cost_rs": 1850, "color": "#10b981"},
    {"category": "Meat & Seafood Bones/Trimmings", "weight_kg": 3.8, "percentage": 17.7, "cost_rs": 3200, "color": "#ef4444"},
    {"category": "Bakery & Bread Waste", "weight_kg": 2.6, "percentage": 12.1, "cost_rs": 950, "color": "#8b5cf6"},
    {"category": "Spoiled / Overripe Produce", "weight_kg": 2.5, "percentage": 11.5, "cost_rs": 1100, "color": "#ec4899"}
]

DAILY_WASTE_TREND = [
    {"day": "Mon", "total_food_waste_kg": 21.4, "cost_loss_rs": 8200},
    {"day": "Tue", "total_food_waste_kg": 19.8, "cost_loss_rs": 7600},
    {"day": "Wed", "total_food_waste_kg": 24.5, "cost_loss_rs": 9400},
    {"day": "Thu", "total_food_waste_kg": 18.2, "cost_loss_rs": 7100},
    {"day": "Fri (Today)", "total_food_waste_kg": 28.5, "cost_loss_rs": 10900},
    {"day": "Sat (Projected)", "total_food_waste_kg": 34.0, "cost_loss_rs": 13200},
    {"day": "Sun (Projected)", "total_food_waste_kg": 31.5, "cost_loss_rs": 12100}
]

@router.get("/metrics")
def get_waste_metrics():
    """Retrieve smart waste bin telemetry, classification analytics, and reduction recommendations."""
    return {
        "researcher": "Pathirana P.R.T (IT23324060)",
        "module": "Component 4: AI & IoT-Based Automatic Waste Identification, Categorization, and Monitoring",
        "hardware_status": {
            "mcu": "ESP32 Wi-Fi / MQTT Controller (Online)",
            "sorting_mechanism": "Servo Flap & Rotating Motorized Sorter (Active)",
            "load_cells": "4x HX711 Calibrated",
            "ultrasonic_sensors": "4x HC-SR04 Active"
        },
        "total_food_waste_today_kg": 28.5,
        "total_cost_loss_today": "LKR 10,900.00",
        "estimated_monthly_saving_potential": "LKR 84,500.00",
        "compartments": SMART_BIN_COMPARTMENTS,
        "waste_composition": WASTE_COMPOSITION,
        "daily_trend": DAILY_WASTE_TREND,
        "waste_reduction_recommendations": [
            "⚠️ Rice Portioning Notice: Cooked rice accounts for 34.5% of daily food waste. Reduce default plate portion by 15% and offer free refills on request.",
            "Vegetable Trim Optimization: 5.2 kg vegetable cuttings detected today. Shift clean carrot/onion scraps to stock pot simmering.",
            "Closed Feedback to Component 1: Excessive Seafood Rice waste on Thursdays (-8% demand adjustment recommended for next cycle)."
        ]
    }
