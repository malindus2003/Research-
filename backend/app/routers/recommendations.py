from fastapi import APIRouter
from typing import List, Dict, Any
from ..data.mock_data import INITIAL_RECOMMENDATIONS, STORAGE_ZONES
from .inventory import inventory_db

router = APIRouter(prefix="/api/recommendations", tags=["Actionable Recommendations"])

recommendations_db = list(INITIAL_RECOMMENDATIONS)

@router.get("/")
def get_recommendations():
    """Retrieve prioritized kitchen recommendations and active warning alerts."""
    # Dynamically augment with any high/critical inventory items
    active_alerts = []
    
    for item in inventory_db:
        if item["risk_level"] == "Critical":
            active_alerts.append({
                "id": f"dyn-crit-{item['id']}",
                "type": "DISPOSAL_WARNING",
                "severity": "critical",
                "title": f"Spoilage Alert: {item['name']}",
                "item_name": item["name"],
                "zone": item["storage_zone"],
                "message": f"Spoilage probability reached {item['spoilage_prob']}%. Zero remaining shelf life.",
                "suggested_action": "Isolate from storage immediately to prevent bacterial cross-contamination."
            })
        elif item["risk_level"] == "High":
            active_alerts.append({
                "id": f"dyn-high-{item['id']}",
                "type": "PRIORITY_USE",
                "severity": "high",
                "title": f"Expiring Soon: {item['name']}",
                "item_name": item["name"],
                "zone": item["storage_zone"],
                "message": f"Remaining shelf life is {item['remaining_shelf_life_hours']}h. NH3: {item['current_nh3']} ppm.",
                "suggested_action": f"Prioritize {item['quantity']} for immediate kitchen service recipes."
            })

    # Combine static curated advice with dynamic alerts
    combined = active_alerts + recommendations_db
    return {
        "recommendations": combined,
        "critical_count": sum(1 for r in combined if r["severity"] == "critical"),
        "high_priority_count": sum(1 for r in combined if r["severity"] == "high")
    }
