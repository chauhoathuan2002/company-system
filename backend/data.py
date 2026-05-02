import os
import psycopg2

def get_conn():
    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        db_url = "postgresql://postgres.ydkjkputdrarpdzrrhqo:Thuan12122k2@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

    return psycopg2.connect(db_url, sslmode="require")