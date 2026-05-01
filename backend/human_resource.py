from fastapi import APIRouter
from data import get_conn

router = APIRouter()

# ================= NHÂN SỰ =================

@router.get("/employees")
def get_employees():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, employee_code, full_name, workshop,
               birth_date, cccd, gender, address,
               education, start_date, contract_end,
               phone, email, position
        FROM employees
        ORDER BY id DESC
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    data = []
    for r in rows:
        data.append({
            "id": r[0],
            "employee_code": r[1],
            "full_name": r[2],
            "workshop": r[3],
            "birth_date": r[4],
            "cccd": r[5],
            "gender": r[6],
            "address": r[7],
            "education": r[8],
            "start_date": r[9],
            "contract_end": r[10],
            "phone": r[11],
            "email": r[12],
            "position": r[13],
        })

    return data


# ================= THÊM =================

@router.post("/add-employee")
def add_employee(data: dict):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO employees (
            employee_code,
            full_name,
            password,
            role,
            workshop,
            birth_date,
            cccd,
            gender,
            address,
            education,
            start_date,
            contract_end,
            phone,
            email,
            position
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["employee_code"],
        data["full_name"],
        data.get("password", "123456"),
        data.get("role", "nhan_vien"),
        data["workshop"],
        data["birth_date"] or None,
        data["cccd"],
        data["gender"],
        data["address"],
        data["education"],
        data["start_date"] or None,
        data["contract_end"] or None,
        data["phone"],
        data["email"],
        data["position"]
    ))

    conn.commit()
    cur.close()
    conn.close()

    return {"success": True}


# ================= SỬA =================

@router.put("/update-employee/{emp_id}")
def update_employee(emp_id: int, data: dict):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        UPDATE employees
        SET full_name=%s,
            workshop=%s,
            birth_date=%s,
            cccd=%s,
            gender=%s,
            address=%s,
            education=%s,
            start_date=%s,
            contract_end=%s,
            phone=%s,
            email=%s,
            position=%s
        WHERE id=%s
    """, (
        data["full_name"],
        data["workshop"],
        data["birth_date"] or None,
        data["cccd"],
        data["gender"],
        data["address"],
        data["education"],
        data["start_date"] or None,
        data["contract_end"] or None,
        data["phone"],
        data["email"],
        data["position"],
        emp_id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return {"success": True}


# ================= XÓA =================

@router.delete("/delete-employee/{emp_id}")
def delete_employee(emp_id: int):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("DELETE FROM employees WHERE id=%s", (emp_id,))

    conn.commit()
    cur.close()
    conn.close()

    return {"success": True}