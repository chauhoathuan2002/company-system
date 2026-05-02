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
    return {"message": "API Running"}

# ================= LOGIN =================
@app.post("/login")
def login(data: dict):
    try:
        conn = get_conn()
        cur = conn.cursor()

        code = str(data.get("employee_code", "")).strip()
        password = str(data.get("password", "")).strip()

        print("Mã NV nhập:", code)
        print("Mật khẩu nhập:", password)

        # Kiểm tra có tài khoản không
        cur.execute("""
            SELECT employee_code, password, full_name, role
            FROM employees
            WHERE employee_code=%s
        """, (code,))

        row = cur.fetchone()

        if not row:
            cur.close()
            conn.close()
            return {
                "success": False,
                "message": "Không tồn tại mã nhân viên"
            }

        db_code = row[0]
        db_pass = row[1]
        full_name = row[2]
        role = row[3]

        print("DB Password:", db_pass)

        # So sánh mật khẩu
        if str(db_pass).strip() != password:
            cur.close()
            conn.close()
            return {
                "success": False,
                "message": f"Sai mật khẩu. DB đang là: {db_pass}"
            }

        cur.close()
        conn.close()

        # Phân quyền
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
            "message": "Đăng nhập đúng rồi nè",
            "name": full_name,
            "role": role,
            "page": page
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Lỗi login: {str(e)}"
        }

# ================= ĐỔI MẬT KHẨU =================
@app.post("/change-password")
def change_password(data: dict):
    try:
        conn = get_conn()
        cur = conn.cursor()

        code = str(data.get("employee_code", "")).strip()
        old_pass = str(data.get("old_password", "")).strip()
        new_pass = str(data.get("new_password", "")).strip()

        if not code or not old_pass or not new_pass:
            return {
                "success": False,
                "message": "Thiếu thông tin"
            }

        cur.execute("""
            SELECT id FROM employees
            WHERE employee_code=%s AND password=%s
        """, (code, old_pass))

        user = cur.fetchone()

        if not user:
            cur.close()
            conn.close()
            return {
                "success": False,
                "message": "Mật khẩu cũ sai"
            }

        cur.execute("""
            UPDATE employees
            SET password=%s
            WHERE employee_code=%s
        """, (new_pass, code))

        conn.commit()

        cur.close()
        conn.close()

        return {
            "success": True,
            "message": "Đổi mật khẩu thành công"
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Lỗi đổi mật khẩu: {str(e)}"
        }

# ================= INCLUDE ROUTER =================
app.include_router(hr_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)