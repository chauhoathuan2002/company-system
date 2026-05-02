import os
import psycopg2

def get_conn():
    try:
        db_url = os.getenv("DATABASE_URL")

        # Nếu chưa có ENV thì dùng link mặc định
        if not db_url:
            db_url = "postgresql://postgres:Thuan12122k2@db.ydkjkputdrarpdzrrhqo.supabase.co:6543/postgres"

        conn = psycopg2.connect(
            db_url,
            sslmode="require"
        )

        return conn

    except Exception as e:
        print("Lỗi kết nối database:", e)
        raise e