from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from datetime import datetime
from ..data.mock_data import INITIAL_INVENTORY, STORAGE_ZONES
from ..models.ml_engine import ml_spoilage_engine
from ..schemas import SensorReading

router = APIRouter(prefix="/api/inventory", tags=["Inventory Management"])

# In-memory inventory state
inventory_db = list(INITIAL_INVENTORY)

@router.get("/items")
def get_inventory_items(category: Optional[str] = None, risk_level: Optional[str] = None):
    """List all tracked perishable food batches (fruits, vegetables, dairy, fish, meats)."""
    items = inventory_db
    if category and category.lower() != "all":
        items = [i for i in items if i["category"].lower() == category.lower()]
    if risk_level and risk_level.lower() != "all":
        items = [i for i in items if i["risk_level"].lower() == risk_level.lower()]
    return {"items": items, "total_count": len(items)}

@router.post("/items")
def add_inventory_item(item: Dict[str, Any]):
    """Register a new perishable inventory batch into cold storage."""
    new_id = f"inv-{len(inventory_db) + 1:03d}"
    
    # Match zone
    zone = next((z for z in STORAGE_ZONES if z["name"] == item.get("storage_zone")), STORAGE_ZONES[0])
    sensor = SensorReading(
        storage_zone=zone["name"],
        temperature=zone["current_temp"],
        humidity=zone["current_humidity"],
        nh3=zone["nh3"],
        co2=zone["co2"],
        voc=zone["voc"]
    )
    
    pred = ml_spoilage_engine.predict(
        item_name=item.get("name", "New Item"),
        category=item.get("category", "Fruits"),
        storage_duration_hours=float(item.get("storage_duration_hours", 0.0)),
        sensor=sensor
    )

    new_item = {
        "id": new_id,
        "name": item.get("name"),
        "category": item.get("category"),
        "storage_zone": zone["name"],
        "batch_number": item.get("batch_number", f"BAT-{datetime.now().strftime('%Y%m%d-%H%M')}"),
        "quantity": item.get("quantity", "10 kg"),
        "stored_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "storage_duration_hours": float(item.get("storage_duration_hours", 0.0)),
        "current_temp": zone["current_temp"],
        "current_humidity": zone["current_humidity"],
        "current_nh3": zone["nh3"],
        "current_co2": zone["co2"],
        "current_voc": zone["voc"],
        "spoilage_prob": pred.spoilage_probability,
        "remaining_shelf_life_hours": pred.remaining_shelf_life_hours,
        "risk_level": pred.risk_level,
        "status": "Fresh" if pred.risk_level == "Low" else ("Action Required" if pred.risk_level == "High" else ("Spoiled" if pred.risk_level == "Critical" else "Moderate")),
        "recommendation": pred.recommendations[0] if pred.recommendations else "Standard rotation"
    }

    inventory_db.insert(0, new_item)
    return {"status": "success", "item": new_item}

@router.delete("/items/{item_id}")
def delete_inventory_item(item_id: str):
    """Remove a dispatched or disposed food batch."""
    global inventory_db
    inventory_db = [i for i in inventory_db if i["id"] != item_id]
    return {"status": "success", "message": f"Item {item_id} removed"}
