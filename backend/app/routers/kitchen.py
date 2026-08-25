from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api/kitchen", tags=["Component 2: Kitchen Efficiency & Staff Optimization"])

KITCHEN_STATIONS = [
    {
        "id": "station-1",
        "name": "Hot Wok & Kottu Station",
        "active_cooks": 2,
        "recommended_cooks": 3,
        "avg_prep_time_mins": 8.5,
        "target_prep_time_mins": 6.0,
        "queue_length": 14,
        "load_level": 92,
        "bottleneck_status": "High Delay Risk",
        "action": "Allocate 1 auxiliary chef from Cold Larder station immediately"
    },
    {
        "id": "station-2",
        "name": "Curry & Rice Assembly Bay",
        "active_cooks": 2,
        "recommended_cooks": 2,
        "avg_prep_time_mins": 4.2,
        "target_prep_time_mins": 4.5,
        "queue_length": 4,
        "load_level": 55,
        "bottleneck_status": "Smooth Flow",
        "action": "Maintain current line staffing"
    },
    {
        "id": "station-3",
        "name": "Grill & Seafood Station",
        "active_cooks": 1,
        "recommended_cooks": 2,
        "avg_prep_time_mins": 14.0,
        "target_prep_time_mins": 10.0,
        "queue_length": 9,
        "load_level": 84,
        "bottleneck_status": "Moderate Bottleneck",
        "action": "Prep protein cuts in advance to reduce grilling latency"
    },
    {
        "id": "station-4",
        "name": "Salad & Cold Prep Station",
        "active_cooks": 2,
        "recommended_cooks": 1,
        "avg_prep_time_mins": 3.0,
        "target_prep_time_mins": 4.0,
        "queue_length": 2,
        "load_level": 30,
        "bottleneck_status": "Underutilized",
        "action": "Reassign 1 staff member to Kottu Station during 7 PM rush"
    }
]

STAFF_MEMBERS = [
    {
        "id": "staff-1",
        "name": "K. Perera (Senior Line Chef)",
        "assigned_station": "Hot Wok & Kottu Station",
        "shift": "11:00 AM - 09:30 PM",
        "efficiency_rating": 94,
        "skill_level": "Expert (Level 4)",
        "speed_score": "4.8 / 5.0",
        "skill_gap": "Advanced Pastry & Bakery",
        "training_recommendation": "Executive Kitchen Leadership & Precision Temperature Control",
        "career_progression": "Ready for Sous-Chef Promotion (88% Milestones Complete)"
    },
    {
        "id": "staff-2",
        "name": "S. Fernando (Junior Chef)",
        "assigned_station": "Salad & Cold Prep Station",
        "shift": "03:00 PM - 11:00 PM",
        "efficiency_rating": 78,
        "skill_level": "Intermediate (Level 2)",
        "speed_score": "3.9 / 5.0",
        "skill_gap": "High-Heat Wok Handling & Kottu Speed",
        "training_recommendation": "Enrolled in 'High-Volume Stir-Fry Optimization' (Module 3)",
        "career_progression": "Target: Line Cook Specialist (62% Completed)"
    },
    {
        "id": "staff-3",
        "name": "T. Silva (Prep Cook)",
        "assigned_station": "Grill & Seafood Station",
        "shift": "10:00 AM - 07:00 PM",
        "efficiency_rating": 85,
        "skill_level": "Intermediate (Level 3)",
        "speed_score": "4.2 / 5.0",
        "skill_gap": "HACCP Seafood Core Temperature Monitoring",
        "training_recommendation": "Seafood Freshness Grading & Quick-Sear Techniques",
        "career_progression": "Grill Master Track (74% Completed)"
    }
]

PEAK_HOURS_DATA = [
    {"hour": "11:00", "predicted_orders": 24, "staff_required": 4, "actual_staff": 4},
    {"hour": "12:00", "predicted_orders": 68, "staff_required": 7, "actual_staff": 6},
    {"hour": "13:00 (Lunch Peak)", "predicted_orders": 95, "staff_required": 8, "actual_staff": 8},
    {"hour": "14:00", "predicted_orders": 45, "staff_required": 5, "actual_staff": 5},
    {"hour": "15:00", "predicted_orders": 18, "staff_required": 3, "actual_staff": 3},
    {"hour": "16:00", "predicted_orders": 22, "staff_required": 3, "actual_staff": 3},
    {"hour": "17:00", "predicted_orders": 38, "staff_required": 5, "actual_staff": 4},
    {"hour": "18:00", "predicted_orders": 74, "staff_required": 7, "actual_staff": 7},
    {"hour": "19:00 (Dinner Peak)", "predicted_orders": 115, "staff_required": 9, "actual_staff": 7},
    {"hour": "20:00 (Dinner Rush)", "predicted_orders": 105, "staff_required": 9, "actual_staff": 8},
    {"hour": "21:00", "predicted_orders": 52, "staff_required": 5, "actual_staff": 6}
]

@router.get("/metrics")
def get_kitchen_metrics():
    """Retrieve kitchen workflow analytics, peak hour forecasts, and staff development data."""
    return {
        "researcher": "Pahesara H.H.D.S (IT23349292)",
        "module": "Component 2: Kitchen Efficiency and Staff Optimization Analytics",
        "overall_kitchen_efficiency": "88.5%",
        "avg_ticket_fulfillment_time": "7.4 mins",
        "active_bottlenecks_count": 1,
        "stations": KITCHEN_STATIONS,
        "staff": STAFF_MEMBERS,
        "hourly_peak_forecast": PEAK_HOURS_DATA,
        "ai_allocation_suggestions": [
            "⚠️ DINNER RUSH ALERT: Station 1 (Hot Wok) requires +1 Cook at 7:00 PM due to 115 projected orders.",
            "Reallocate S. Fernando from Cold Prep to Hot Wok during 7:00 PM - 9:00 PM window.",
            "Pre-portion 50x Curry bases at 5:30 PM to bypass assembly bottlenecks."
        ]
    }
