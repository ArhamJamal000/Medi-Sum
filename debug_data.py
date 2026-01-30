from app import app, db, User, Prescription, Medicine, MedicalTest

def check_data():
    with app.app_context():
        users = User.query.all()
        print(f"Total Users: {len(users)}")
        
        for user in users:
            print(f"\nUser: {user.name} (ID: {user.user_id}, Role: {user.role})")
            prescriptions = Prescription.query.filter_by(user_id=user.user_id).all()
            print(f"  Prescriptions: {len(prescriptions)}")
            
            for p in prescriptions:
                meds = Medicine.query.filter_by(prescription_id=p.prescription_id).all()
                tests = MedicalTest.query.filter_by(prescription_id=p.prescription_id).all()
                print(f"    Rx #{p.prescription_id} (Date: {p.upload_date}): {len(meds)} meds, {len(tests)} tests")
                for m in meds:
                    print(f"      - Med: {m.name} (Start: {m.start_date})")

if __name__ == "__main__":
    check_data()
