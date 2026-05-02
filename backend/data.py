import os
import psycopg2

def get_conn():
    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        db_url = "postgresql://postgres:Thuan12122k2@db.ydkjkputdrarpdzrrhqo.supabase.co:5432/postgres?sslmode=require"

    return psycopg2.connect(db_url)