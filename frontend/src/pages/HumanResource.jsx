import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

/* ================= COMPONENT NGOÀI ================= */

function InputBox({
  label,
  value,
  onChange,
  type = "text",
  col = "col-md-4",
  disabled = false,
}) {
  return (
    <div className={col}>
      <label className="fw-semibold small mb-1">{label}</label>
      <input
        type={type}
        className="form-control"
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
  col = "col-md-4",
}) {
  return (
    <div className={col}>
      <label className="fw-semibold small mb-1">{label}</label>

      <select
        className="form-select"
        value={value}
        onChange={onChange}
      >
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormBox({
  form,
  selected,
  edit,
  changeForm,
  saveFn,
}) {
  return (
    <div className="row g-3">
      {edit && (
        <InputBox
          label="Mã NV"
          value={selected?.employee_code}
          disabled={true}
        />
      )}

      <InputBox
        label="Họ tên"
        value={form.full_name}
        onChange={(e) =>
          changeForm("full_name", e.target.value)
        }
      />

      <InputBox
        label="Ngày sinh"
        type="date"
        value={form.birth_date}
        onChange={(e) =>
          changeForm("birth_date", e.target.value)
        }
      />

      <InputBox
        label="CCCD"
        value={form.cccd}
        onChange={(e) =>
          changeForm("cccd", e.target.value)
        }
      />

      <SelectBox
        label="Giới tính"
        value={form.gender}
        onChange={(e) =>
          changeForm("gender", e.target.value)
        }
        options={[
          { value: "Nam", label: "Nam" },
          { value: "Nữ", label: "Nữ" },
        ]}
      />

      <InputBox
        label="SĐT"
        value={form.phone}
        onChange={(e) =>
          changeForm("phone", e.target.value)
        }
      />

      <InputBox
        label="Email"
        value={form.email}
        onChange={(e) =>
          changeForm("email", e.target.value)
        }
      />

      <SelectBox
        label="Phòng ban"
        value={form.workshop}
        onChange={(e) =>
          changeForm("workshop", e.target.value)
        }
        options={[
          { value: "0", label: "Văn phòng" },
          { value: "1", label: "Xưởng 1" },
          { value: "2", label: "Xưởng 2" },
          { value: "3", label: "Xưởng 3" },
          { value: "4", label: "Xưởng 4" },
        ]}
      />

      <SelectBox
        label="Chức vụ"
        value={form.position}
        onChange={(e) =>
          changeForm("position", e.target.value)
        }
        options={[
          { value: "Nhân viên", label: "Nhân viên" },
          { value: "Tổ trưởng", label: "Tổ trưởng" },
          { value: "Quản lý", label: "Quản lý" },
          { value: "Trưởng phòng", label: "Trưởng phòng" },
        ]}
      />

      <InputBox
        label="Trình độ"
        value={form.education}
        onChange={(e) =>
          changeForm("education", e.target.value)
        }
      />

      <InputBox
        label="Ngày vào làm"
        type="date"
        value={form.start_date}
        onChange={(e) =>
          changeForm("start_date", e.target.value)
        }
      />

      <InputBox
        label="Hết hạn HĐ"
        type="date"
        value={form.contract_end}
        onChange={(e) =>
          changeForm("contract_end", e.target.value)
        }
      />

      <InputBox
        label="Địa chỉ"
        col="col-md-12"
        value={form.address}
        onChange={(e) =>
          changeForm("address", e.target.value)
        }
      />

      <div className="col-12">
        <button
          className="btn btn-primary w-100"
          onClick={saveFn}
        >
          Lưu thông tin
        </button>
      </div>
    </div>
  );
}


/* ================= COMPONENT CHÍNH ================= */

function HumanResource({ setUser }) {
  const API = "https://company-system-gb59.onrender.com";
  const perPage = 10;

  const emptyForm = {
    full_name: "",
    birth_date: "",
    cccd: "",
    gender: "Nam",
    address: "",
    education: "",
    workshop: "0",
    start_date: "",
    contract_end: "",
    phone: "",
    email: "",
    position: "Nhân viên",
  };

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [workshop, setWorkshop] = useState("");

  const [page, setPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetch(API + "/employees");
const result = await res.json();

if(result.success){
   setEmployees(result.data);
}else{
   alert(result.error);
}
    } catch {
      alert("Không tải được dữ liệu");
    }
  };

  const changeForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getWorkshopName = (val) => {
    const v = String(val);

    if (v === "0" || val === null) return "Văn phòng";
    if (v === "1") return "Xưởng 1";
    if (v === "2") return "Xưởng 2";
    if (v === "3") return "Xưởng 3";
    if (v === "4") return "Xưởng 4";

    return "";
  };

  const getPrefix = (val) => {
    return String(val) === "0"
      ? "VP"
      : "X" + val;
  };

  const generateCode = () => {
    const prefix = getPrefix(form.workshop);

    const count =
      employees.filter((e) =>
        e.employee_code?.startsWith(prefix)
      ).length + 1;

    return prefix + String(count).padStart(3, "0");
  };

  const addEmployee = async () => {
    try {
      await fetch(`${API}/add-employee`, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          employee_code: generateCode(),
          password: "123456",
          role: "nhanvien",
          ...form,
        }),
      });

      setShowAdd(false);
      setForm(emptyForm);
      loadEmployees();
    } catch {
      alert("Lỗi thêm nhân viên");
    }
  };

  const openDetail = (emp) => {
    setSelected(emp);

    setForm({
      full_name: emp.full_name || "",
      birth_date: emp.birth_date || "",
      cccd: emp.cccd || "",
      gender: emp.gender || "Nam",
      address: emp.address || "",
      education: emp.education || "",
      workshop:
        emp.workshop === null
          ? "0"
          : String(emp.workshop),
      start_date: emp.start_date || "",
      contract_end:
        emp.contract_end || "",
      phone: emp.phone || "",
      email: emp.email || "",
      position:
        emp.position || "Nhân viên",
    });

    setShowDetail(true);
  };

  const updateEmployee = async () => {
    try {
      await fetch(
        `${API}/update-employee/${selected.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      setShowDetail(false);
      loadEmployees();
    } catch {
      alert("Lỗi cập nhật");
    }
  };

  const deleteEmployee = async () => {
    if (!window.confirm("Xóa nhân viên này?"))
      return;

    try {
      await fetch(
        `${API}/delete-employee/${selected.id}`,
        {
          method: "DELETE",
        }
      );

      setShowDetail(false);
      loadEmployees();
    } catch {
      alert("Lỗi xóa");
    }
  };

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const text =
        `${e.employee_code} ${e.full_name} ${e.phone} ${e.email}`.toLowerCase();

      return (
        text.includes(
          search.toLowerCase()
        ) &&
        (gender === "" ||
          e.gender === gender) &&
        (workshop === "" ||
          String(e.workshop) ===
            workshop)
      );
    });
  }, [employees, search, gender, workshop]);

  const totalPages = Math.ceil(
    filtered.length / perPage
  );

  const currentData = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const exportExcel = () => {
    const rows = filtered.map((e, i) => ({
      STT: i + 1,
      "Mã NV": e.employee_code,
      "Họ tên": e.full_name,
      "SĐT": e.phone,
      Email: e.email,
      "Chức vụ": e.position,
      "Phòng ban":
        getWorkshopName(e.workshop),
    }));

    const ws =
      XLSX.utils.json_to_sheet(rows);

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "NhanSu"
    );

    XLSX.writeFile(wb, "NhanSu.xlsx");
  };

  return (
    <div className="bg-light min-vh-100">
      {/* HEADER */}
      <div className="bg-primary text-white p-3 shadow">
        <div className="row g-2">
          <div className="col-lg-2 col-12">
            <button
              className="btn btn-light w-100 fw-bold"
              onClick={() => {
                setForm(emptyForm);
                setShowAdd(true);
              }}
            >
              + Thêm NV
            </button>
          </div>

          <div className="col-lg-3 col-12">
            <input
              className="form-control"
              placeholder="Tìm kiếm..."
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setPage(1);
              }}
            />
          </div>

          <div className="col-lg-2 col-6">
            <select
              className="form-select"
              onChange={(e) => {
                setWorkshop(
                  e.target.value
                );
                setPage(1);
              }}
            >
              <option value="">
                Phòng ban
              </option>
              <option value="0">
                Văn phòng
              </option>
              <option value="1">
                Xưởng 1
              </option>
              <option value="2">
                Xưởng 2
              </option>
              <option value="3">
                Xưởng 3
              </option>
              <option value="4">
                Xưởng 4
              </option>
            </select>
          </div>

          <div className="col-lg-2 col-6">
            <select
              className="form-select"
              onChange={(e) => {
                setGender(
                  e.target.value
                );
                setPage(1);
              }}
            >
              <option value="">
                Giới tính
              </option>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>

          <div className="col-lg-2 col-6">
            <button
              className="btn btn-success w-100"
              onClick={exportExcel}
            >
              Excel
            </button>
          </div>

          <div className="col-lg-1 col-6">
         <button
  type="button"
  className="btn btn-danger w-100"
  style={{ zIndex: 1 }}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    if (setUser) setUser(null);

    window.location.replace("/");
  }}
>
  Thoát
</button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="container-fluid py-4">
        <div className="card shadow border-0 rounded-4">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Mã NV</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Chức vụ</th>
                  <th>Phòng ban</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((e) => (
                  <tr
                    key={e.id}
                    style={{
                      cursor:
                        "pointer",
                    }}
                    onClick={() =>
                      openDetail(e)
                    }
                  >
                    <td>
                      {
                        e.employee_code
                      }
                    </td>
                    <td>
                      {e.full_name}
                    </td>
                    <td>{e.phone}</td>
                    <td>{e.email}</td>
                    <td>
                      {e.position}
                    </td>
                    <td>
                      {getWorkshopName(
                        e.workshop
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PAGE */}
      <div className="text-center pb-4">
        <button
          className="btn btn-outline-primary me-2"
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
        >
          Trước
        </button>

        <span className="fw-bold">
          Trang {page} /{" "}
          {totalPages || 1}
        </span>

        <button
          className="btn btn-outline-primary ms-2"
          disabled={
            page === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setPage(page + 1)
          }
        >
          Sau
        </button>
      </div>

      {/* ADD */}
      {showAdd && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="mb-0">
                  Thêm nhân viên
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setShowAdd(false)
                  }
                ></button>
              </div>

              <div className="modal-body">
                <FormBox
                  form={form}
                  changeForm={
                    changeForm
                  }
                  saveFn={
                    addEmployee
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL */}
      {showDetail &&
        selected && (
          <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content rounded-4 border-0">
                <div className="modal-header bg-primary text-white">
                  <h5 className="mb-0">
                    Chi tiết nhân viên
                  </h5>

                  <button
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setShowDetail(
                        false
                      )
                    }
                  ></button>
                </div>

                <div className="modal-body">
                  <FormBox
                    form={form}
                    selected={
                      selected
                    }
                    edit={true}
                    changeForm={
                      changeForm
                    }
                    saveFn={
                      updateEmployee
                    }
                  />

                  <button
                    className="btn btn-danger w-100 mt-3"
                    onClick={
                      deleteEmployee
                    }
                  >
                    Xóa nhân viên
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default HumanResource;