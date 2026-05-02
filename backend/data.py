import os
import psycopg2

def get_conn():
    # Lấy chuỗi kết nối từ biến môi trường để bảo mật
    # Nếu không tìm thấy biến môi trường, sẽ sử dụng chuỗi mặc định (Connection Pooler)
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        # Chuỗi kết nối trực tiếp sử dụng Transaction Pooler (Cổng 6543) để chạy ổn định trên Render
        db_url = "postgresql://postgres:Thuan12122k2@db.ydkjkputdrarpdzrrhqo.supabase.co:6543/postgres?sslmode=require"
    
    return psycopg2.connect(db_url)