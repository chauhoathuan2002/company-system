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
    conn = get_conn()
    cur = conn.cursor()

    code = data["employee_code"].strip()
    password = data["password"].strip()

    cur.execute("""
        SELECT employee_code, password, full_name, position
        FROM employees
        WHERE employee_code=%s
    """, (code,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return {"success": False, "message": "Không tồn tại mã NV"}

    if row[1] != password:
        return {
            "success": False,
            "message": f"Sai mật khẩu. DB đang là: {row[1]}"
        }

    return {
        "success": True,
        "name": row[2],
        "page": "human_resource"
    }
# ================= ĐỔI MẬT KHẨU =================
# THÊM VÀO main.py

@app.post("/change-password")
def change_password(data: dict):
    conn = get_conn()
    cur = conn.cursor()

    # kiểm tra tài khoản + mật khẩu cũ
    cur.execute("""
        SELECT id FROM employees
        WHERE employee_code=%s AND password=%s
    """, (
        data["employee_code"],
        data["old_password"]
    ))

    user = cur.fetchone()

    if not user:
        cur.close()
        conn.close()
        return {
            "success": False,
            "message": "Mã nhân viên hoặc mật khẩu cũ sai"
        }

    # cập nhật mật khẩu mới
    cur.execute("""
        UPDATE employees
        SET password=%s
        WHERE employee_code=%s
    """, (
        data["new_password"],
        data["employee_code"]
    ))

    conn.commit()

    cur.close()
    conn.close()

    return {
        "success": True,
        "message": "Đổi mật khẩu thành công"
    }

# ================= INCLUDE ROUTER =================
app.include_router(hr_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)