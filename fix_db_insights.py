import sqlite3
import os

DB_PATH = 'instance/medisum.db'

def fix_database_insights():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check existing columns in prescriptions
    cursor.execute("PRAGMA table_info(prescriptions)")
    columns = [info[1] for info in cursor.fetchall()]
    print(f"Current columns in prescriptions: {columns}")
    
    # Add key_insights if missing
    if 'key_insights' not in columns:
        print("Adding key_insights column...")
        try:
            cursor.execute("ALTER TABLE prescriptions ADD COLUMN key_insights TEXT")
            print("Successfully added key_insights")
        except Exception as e:
            print(f"Error adding key_insights: {e}")
            
    conn.commit()
    conn.close()
    print("Database schema update complete!")

if __name__ == '__main__':
    fix_database_insights()
