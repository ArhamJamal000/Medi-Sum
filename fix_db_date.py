import sqlite3
import os

DB_PATH = 'instance/medisum.db'

def fix_database_date():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check existing columns in prescriptions
    cursor.execute("PRAGMA table_info(prescriptions)")
    columns = [info[1] for info in cursor.fetchall()]
    print(f"Current columns in prescriptions: {columns}")
    
    # Add prescription_date if missing
    if 'prescription_date' not in columns:
        print("Adding prescription_date column...")
        try:
            cursor.execute("ALTER TABLE prescriptions ADD COLUMN prescription_date DATE")
            print("Successfully added prescription_date")
        except Exception as e:
            print(f"Error adding prescription_date: {e}")
            
    conn.commit()
    conn.close()
    print("Database schema update complete!")

if __name__ == '__main__':
    fix_database_date()
