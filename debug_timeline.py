from app import app, db, User, Prescription, Medicine, MedicalTest
from datetime import datetime

def simulate_timeline(user_id):
    with app.app_context():
        user = User.query.get(user_id)
        print(f"--- Simulating Timeline for User: {user.name} (ID: {user.user_id}) ---")
        
        # 1. Fetch Medicines
        med_query = db.session.query(Medicine).join(Prescription).filter(
            Prescription.user_id == user_id
        )
        
        # 2. Fetch Tests
        test_query = db.session.query(MedicalTest).join(Prescription).filter(
            Prescription.user_id == user_id
        )
        
        # 3. Fetch Prescriptions (to catch those with no extracted data)
        pres_query = Prescription.query.filter_by(user_id=user_id)
        
        medicines = med_query.all()
        tests = test_query.all()
        prescriptions = pres_query.all()
        
        print(f"Medicines Found: {len(medicines)}")
        print(f"Tests Found: {len(tests)}")
        print(f"Prescriptions Found: {len(prescriptions)}")
        
        # Unify and Sort Events
        events = []
        covered_prescription_ids = set()
        
        for med in medicines:
            events.append(f"MED: {med.name}")
            covered_prescription_ids.add(med.prescription_id)
            
        for test in tests:
            events.append(f"TEST: {test.test_name}")
            covered_prescription_ids.add(test.prescription_id)
            
        print(f"Covered Prescriptions: {covered_prescription_ids}")
        
        for p in prescriptions:
            if p.prescription_id not in covered_prescription_ids:
                events.append(f"PRESCRIPTION: ID {p.prescription_id} (Date: {p.upload_date})")
                
        print(f"\nTotal Events Generated: {len(events)}")
        for e in events:
            print(e)

if __name__ == "__main__":
    # Simulate for User 1 (who had 0 meds before)
    simulate_timeline(1)
