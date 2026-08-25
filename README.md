# AI & IoT-Based Smart Restaurant Management System
## Component 3: AI-Based Multi-Modal Food Spoilage Prediction and Quality Assessment Module

**Researcher**: Maddumage M. S (IT23348820)  
**Research Cluster**: SST (Smart Systems and Technologies)  
**University**: SLIIT - IT4010 Research Project 2026

---

## 🌟 Overview & Key Capabilities

This system provides a predictive and real-time food spoilage detection and quality assessment platform tailored for restaurant cold chain management:

1. **IoT Multi-Sensor Environmental Telemetry**:
   - ESP32 microcontroller telemetry streaming
   - Measures **Temperature (°C)**, **Relative Humidity (%)**, **Ammonia ($\text{NH}_3$)**, **Carbon Dioxide ($\text{CO}_2$)**, and **Volatile Organic Compounds (VOC)**.
   - Real-time 24-hour time-series trend graphs across 5 cold storage zones (Meat Chiller, Seafood Ice Chiller, Dairy Refrigerator, Fruit Chamber, Vegetable Crisper).

2. **Computer Vision Food Quality Inspection**:
   - Evaluates surface discoloration %, microbial/fungal mould colony patches, texture degradation, and ripeness stage across food categories (*Meat, Fish, Dairy, Fruits, Vegetables*).
   - Works with uploaded images or preset test samples.

3. **Multi-Modal AI Fusion Engine**:
   - Merges IoT sensory parameters with visual defect features.
   - Predicts **Remaining Shelf-Life (RSL in hours)** and **Spoilage Probability (%)**.
   - Categorizes batches into 4 intuitive risk levels: `Low (Fresh)`, `Medium`, `High (Priority Use)`, and `Critical (Disposal)`.

4. **Intelligent Kitchen Action Recommendations**:
   - **FIFO Priority Recipe Routing**: Suggests specific dishes to cook immediately with batches expiring soon.
   - **Storage Calibration**: Suggests thermostat and ventilation adjustments when gas/thermal drift is detected.
   - **Early Spoilage Warnings**: Alerts kitchen staff to isolate contaminated batches and avoid food poisoning/cross-contamination.

5. **ESP32 Hardware Emulator**:
   - Built-in simulator to send live IoT HTTP telemetry packets and test anomaly spikes (cooling failure, ammonia surges) during demonstrations and viva presentations.

---

## 🚀 How to Run

### 1. Start Backend Server (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*Backend runs on `http://localhost:8000` (Interactive Swagger docs available at `http://localhost:8000/docs`).*

### 2. Start Frontend Dashboard (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend dashboard opens at `http://localhost:5173`.*

---

## 🏗️ Architecture & Component Mapping

| Sub-Objective / Task in Document | Implemented Module |
| :--- | :--- |
| **IoT Sensor Monitoring (Temp, Humidity, $\text{NH}_3$, $\text{CO}_2$, VOC)** | `backend/app/routers/sensors.py` & `frontend/src/components/StorageZoneTelemetry.jsx` |
| **ESP32 Ingestion & Simulator** | `POST /api/sensors/telemetry` & `frontend/src/components/ESP32Simulator.jsx` |
| **Computer Vision Food Quality Analysis** | `backend/app/models/cv_engine.py` & `frontend/src/components/VisionInspector.jsx` |
| **Food Category-Specific Models (Meat, Fish, Dairy, Fruits, Veg)** | `backend/app/models/ml_engine.py` |
| **Remaining Shelf-Life & Spoilage % Prediction** | `backend/app/routers/predictions.py` & `frontend/src/components/MultiModalAssessor.jsx` |
| **Risk Scoring (Low, Med, High, Critical)** | `backend/app/schemas.py` & MultiModal Risk Engine |
| **Intelligent Recommendations & Priority Alerts** | `backend/app/routers/recommendations.py` & `frontend/src/components/ActionRecommendations.jsx` |
| **Perishable Inventory Batch Management** | `backend/app/routers/inventory.py` & `frontend/src/components/InventoryHealthTable.jsx` |
