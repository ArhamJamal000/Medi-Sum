import sqlite3
import os

# Check both potential locations for the DB
DB_FILE = 'medisum.db'
INSTANCE_DB = 'instance/medisum.db'

def fix_db(path):
    if not os.path.exists(path):
        print(f"Skipping {path} (not found)")
        return
        
    print(f"fixing database at: {path}")
    conn = sqlite3.connect(path)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'phone_number' not in columns:
            print("Adding phone_number...")
            cursor.execute("ALTER TABLE users ADD COLUMN phone_number TEXT")
            
        if 'sms_enabled' not in columns:
            print("Adding sms_enabled...")
            cursor.execute("ALTER TABLE users ADD COLUMN sms_enabled BOOLEAN DEFAULT 0")
            
        conn.commit()
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix_db(DB_FILE)
    fix_db(INSTANCE_DB)
