import sqlite3
import os

DB_PATH = 'instance/medisum.db'

def fix_database():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check existing columns in users table
    cursor.execute("PRAGMA table_info(users)")
    columns = [info[1] for info in cursor.fetchall()]
    print(f"Current columns in users: {columns}")
    
    # Add phone_number if missing
    if 'phone_number' not in columns:
        print("Adding phone_number column...")
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN phone_number TEXT")
            print("Successfully added phone_number")
        except Exception as e:
            print(f"Error adding phone_number: {e}")
            
    # Add sms_enabled if missing
    if 'sms_enabled' not in columns:
        print("Adding sms_enabled column...")
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN sms_enabled BOOLEAN DEFAULT 0")
            print("Successfully added sms_enabled")
        except Exception as e:
            print(f"Error adding sms_enabled: {e}")
            
    conn.commit()
    conn.close()
    print("Database schema update complete!")

if __name__ == '__main__':
    fix_database()
