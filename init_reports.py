from app import app, db, LabReport
import os

if os.path.exists('medisum.db'):
    print("Database exists, adding new tables...")
else:
    print("Database does not exist, creating all...")

with app.app_context():
    db.create_all()
    print("Database tables updated.")
