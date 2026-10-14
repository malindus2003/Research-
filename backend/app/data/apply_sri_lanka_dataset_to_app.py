import os
import json
from generate_sl_mock_payloads import generate_sri_lankan_mock_data

def update_all():
    zones, inv, recs, stats = generate_sri_lankan_mock_data()
    
    # 1. Update backend/app/data/mock_data.py
    backend_mock_py = os.path.join(os.path.dirname(__file__), "mock_data.py")
    
    with open(backend_mock_py, "w", encoding="utf-8") as f:
        f.write('import random\n')
        f.write('from datetime import datetime, timedelta\n')
        f.write('from typing import List, Dict, Any\n\n')
        
        inv_str = json.dumps(inv, indent=4).replace(': false', ': False').replace(': true', ': True').replace(': null', ': None')
        zones_str = json.dumps(zones, indent=4).replace(': false', ': False').replace(': true', ': True').replace(': null', ': None')
        f.write('STORAGE_ZONES = ' + zones_str + '\n\n')
        f.write('INITIAL_INVENTORY: List[Dict[str, Any]] = ' + inv_str + '\n\n')
        
        # Serialize RECOMMENDATIONS with datetime objects
        f.write('INITIAL_RECOMMENDATIONS: List[Dict[str, Any]] = [\n')
        for r in recs:
            f.write('    {\n')
            f.write(f'        "id": {json.dumps(r["id"])},\n')
            f.write(f'        "type": {json.dumps(r["type"])},\n')
            f.write(f'        "severity": {json.dumps(r["severity"])},\n')
            f.write(f'        "title": {json.dumps(r["title"])},\n')
            f.write(f'        "item_name": {json.dumps(r["item_name"])},\n')
            f.write(f'        "zone": {json.dumps(r["zone"])},\n')
            f.write(f'        "message": {json.dumps(r["message"])},\n')
            f.write(f'        "suggested_action": {json.dumps(r["suggested_action"])},\n')
            f.write('        "created_at": datetime.now() - timedelta(minutes=30)\n')
            f.write('    },\n')
        f.write(']\n\n')
        
        f.write('''def generate_sensor_history(zone_id: str, hours: int = 24) -> List[Dict[str, Any]]:
    """Generate realistic time-series environmental data for charts."""
    history = []
    zone = next((z for z in STORAGE_ZONES if z["id"] == zone_id), STORAGE_ZONES[0])
    base_temp = zone["current_temp"]
    base_hum = zone["current_humidity"]
    base_nh3 = zone["nh3"]
    base_co2 = zone["co2"]
    base_voc = zone["voc"]

    now = datetime.now()
    for i in range(hours, -1, -1):
        point_time = now - timedelta(hours=i)
        t_drift = random.uniform(-0.35, 0.35)
        h_drift = random.uniform(-1.2, 1.2)
        nh3_drift = random.uniform(-0.01, 0.02)
        co2_drift = random.uniform(-20.0, 30.0)
        voc_drift = random.uniform(-0.02, 0.03)

        history.append({
            "timestamp": point_time.strftime("%H:%M"),
            "full_time": point_time.isoformat(),
            "temperature": round(base_temp + t_drift, 2),
            "humidity": round(base_hum + h_drift, 1),
            "nh3": round(max(0.01, base_nh3 + nh3_drift), 3),
            "co2": round(max(350.0, base_co2 + co2_drift), 1),
            "voc": round(max(0.02, base_voc + voc_drift), 3),
        })
    return history
''')
    print("Updated backend/app/data/mock_data.py successfully!")

    # 2. Update frontend/src/data/mockData.js
    frontend_mock_js = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "src", "data", "mockData.js"))
    with open(frontend_mock_js, "w", encoding="utf-8") as f:
        f.write('// Live Sri Lankan Perishable Inventory & Calibrated Cold Storage Zones\n')
        f.write('export const DEFAULT_ZONES = ' + json.dumps(zones, indent=2) + ';\n\n')
        f.write('export const DEFAULT_INVENTORY = ' + json.dumps(inv, indent=2) + ';\n\n')
        f.write('export const DEFAULT_RECOMMENDATIONS = ' + json.dumps(recs, indent=2) + ';\n\n')
        f.write('export const DEFAULT_DASHBOARD_STATS = ' + json.dumps(stats, indent=2) + ';\n')
    print(f"Updated {frontend_mock_js} successfully!")

if __name__ == "__main__":
    update_all()
