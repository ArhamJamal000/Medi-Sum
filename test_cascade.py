from app import app, db, User, Prescription, Medicine, MedicalTest

def test_cascade():
    with app.app_context():
        # Create a dummy user if needed or use existing
        user = User.query.first()
        if not user:
            print("No user found to test with.")
            return

        # Create dummy prescription
        p = Prescription(user_id=user.user_id, image_path="test_delete.jpg", ocr_text="Test Delete")
        db.session.add(p)
        db.session.commit()
        print(f"Created Prescription ID: {p.prescription_id}")

        # Add medicine and test
        m = Medicine(prescription_id=p.prescription_id, name="Test Med")
        t = MedicalTest(prescription_id=p.prescription_id, test_name="Test Lab")
        db.session.add(m)
        db.session.add(t)
        db.session.commit()
        
        med_id = m.medicine_id
        test_id = t.test_id
        print(f"Created Med ID: {med_id}, Test ID: {test_id}")

        # Verify existence
        print(f"Med exists: {Medicine.query.get(med_id) is not None}")
        
        # Delete Prescription
        print("Deleting Prescription...")
        db.session.delete(p)
        db.session.commit()

        # Verify Deletion
        print(f"Prescription exists: {Prescription.query.get(p.prescription_id) is not None}")
        print(f"Med exists (should be False): {Medicine.query.get(med_id) is not None}")
        print(f"Test exists (should be False): {MedicalTest.query.get(test_id) is not None}")
        
        if Medicine.query.get(med_id) is not None:
            print("❌ CASCADE FAILED: Medicine still exists!")
        else:
            print("✅ CASCADE WORKED: Medicine deleted.")

if __name__ == "__main__":
    test_cascade()
