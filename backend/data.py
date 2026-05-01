import psycopg2

def get_conn():
    return psycopg2.connect(
        host="db.ydkjkputdrarpdzrrhqo.supabase.co",
        database="postgres",
        user="postgres",
        password="Thuan12122k2",
        port="5432"
    )