import sqlite3
import os

DB_PATH = 'instance/medisum.db'

def fix_database_reason():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check existing columns in prescriptions
    cursor.execute("PRAGMA table_info(prescriptions)")
    columns = [info[1] for info in cursor.fetchall()]
    print(f"Current columns in prescriptions: {columns}")
    
    # Add visit_reason if missing
    if 'visit_reason' not in columns:
        print("Adding visit_reason column...")
        try:
            cursor.execute("ALTER TABLE prescriptions ADD COLUMN visit_reason TEXT")
            print("Successfully added visit_reason")
        except Exception as e:
            print(f"Error adding visit_reason: {e}")
            
    conn.commit()
    conn.close()
    print("Database schema update complete!")

if __name__ == '__main__':
    fix_database_reason()
