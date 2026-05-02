from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import get_conn

from human_resource import router as hr_router

app = FastAPI()

origins = [
    "https://congtychauthuan.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ================= HOME =================
@app.get("/")
def home():
    try:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            SELECT id,
                   employee_code,
                   full_name,
                   password,
                   role,
                   workshop,
                   phone,
                   email,
                   position
            FROM employees
            ORDER BY id
        """)

        rows = cur.fetchall()

        data = []

        for r in rows:
            data.append({
                "id": r[0],
                "employee_code": r[1],
                "full_name": r[2],
                "password": r[3],
                "role": r[4],
                "workshop": r[5],
                "phone": r[6],
                "email": r[7],
                "position": r[8]
            })

        cur.close()
        conn.close()

        return {
            "success": True,
            "total": len(data),
            "employees": data
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# ================= LOGIN =================
@app.post("/login")
def login(data: dict):
    try:
        conn = get_conn()
        cur = conn.cursor()

        code = data.get("employee_code", "").strip()
        password = data.get("password", "").strip()

        cur.execute("""
            SELECT full_name, role
            FROM employees
            WHERE employee_code=%s AND password=%s
        """, (code, password))

        user = cur.fetchone()

        cur.close()
        conn.close()

        if not user:
            return {
                "success": False,
                "message": "Sai tài khoản hoặc mật khẩu"
            }

        name = user[0]
        role = user[1]

        if role == "nhansu":
            page = "human_resource"
        elif role == "kehoach":
            page = "planning"
        elif role == "thukho":
            page = "warehouse"
        elif role == "ketoan":
            page = "accounting"
        elif role in ["x1", "x2", "x3", "x4"]:
            page = "workshop"
        elif role == "admin":
            page = "admin"
        else:
            page = "human_resource"

        return {
            "success": True,
            "name": name,
            "role": role,
            "page": page
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
# ================= ĐỔI MẬT KHẨU =================
@app.post("/change-password")
def change_password(data: dict):
    try:
        conn = get_conn()
        cur = conn.cursor()

        # Lấy dữ liệu và xóa khoảng trắng dư thừa
        code = str(data.get("employee_code", "")).strip()
        old_pass = str(data.get("old_password", "")).strip()
        new_pass = str(data.get("new_password", "")).strip()

        if not code or not old_pass or not new_pass:
            return {"success": False, "message": "Thiếu thông tin đổi mật khẩu"}

        # 1. Kiểm tra tài khoản + mật khẩu cũ
        cur.execute("""
            SELECT id FROM employees 
            WHERE employee_code=%s AND password=%s
        """, (code, old_pass))
        
        user = cur.fetchone()

        if not user:
            cur.close()
            conn.close()
            return {"success": False, "message": "Mã nhân viên hoặc mật khẩu cũ không đúng"}

        # 2. Cập nhật mật khẩu mới
        cur.execute("""
            UPDATE employees 
            SET password=%s 
            WHERE employee_code=%s
        """, (new_pass, code))

        conn.commit() # Quan trọng: Phải commit thì mới lưu vào DB
        cur.close()
        conn.close()

        return {"success": True, "message": "Đổi mật khẩu thành công"}

    except Exception as e:
        if 'conn' in locals() and conn:
            conn.close()
        return {"success": False, "message": f"Lỗi hệ thống: {str(e)}"}
# ================= INCLUDE ROUTER =================
app.include_router(hr_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)