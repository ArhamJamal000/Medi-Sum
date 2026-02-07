import psycopg2
from psycopg2 import OperationalError

regions = [
    "aws-0-us-east-1",       # N. Virginia (Most common)
    "aws-0-ap-southeast-1",  # Singapore (Common for Asia)
    "aws-0-eu-central-1",    # Frankfurt
    "aws-0-eu-west-1",       # Ireland
    "aws-0-us-west-1",       # N. California
    "aws-0-ap-northeast-1",  # Tokyo
    "aws-0-ap-northeast-2",  # Seoul
    "aws-0-sa-east-1",       # Sao Paulo
    "aws-0-ca-central-1",    # Canada
    "aws-0-eu-west-2",       # London
    "aws-0-ap-south-1",      # Mumbai
    "aws-0-ap-southeast-2",  # Sydney
    "aws-0-eu-north-1",      # Stockholm
    "aws-0-eu-west-3",       # Paris
    "aws-0-us-east-2",       # Ohio
    "aws-0-us-west-2"        # Oregon
]

project_ref = "ajrlleqjkyzzazvdybvj"
password = "*X538ptSkRjTnUx"
dbname = "postgres"

print(f"Scanning regions for project: {project_ref}...")

for region in regions:
    host = f"{region}.pooler.supabase.com"
    user = f"postgres.{project_ref}"
    dsn = f"dbname='{dbname}' user='{user}' host='{host}' password='{password}' port='6543' sslmode='require'"
    
    print(f"Testing {region}...", end=" ", flush=True)
    
    try:
        conn = psycopg2.connect(dsn, connect_timeout=3)
        print("SUCCESS! FOUND IT!")
        print(f"CORRECT REGION: {region}")
        conn.close()
        break
    except OperationalError as e:
        error_msg = str(e)
        if "Tenant or user not found" in error_msg:
            print("Not here (Tenant not found)")
        elif "password authentication failed" in error_msg:
             print("FOUND IT! (But password might be wrong)")
             print(f"CORRECT REGION: {region}")
             break
        elif "could not translate host name" in error_msg:
             print("Invalid hostname (DNS error)")
        elif "timeout" in error_msg:
             print("Timeout (Likely network blocked)")
        else:
            print(f"Error: {error_msg}")
