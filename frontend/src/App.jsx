import { useState } from "react";
import HumanResource from "./pages/HumanResource";

function App() {
  const API = "https://company-system-gb59.onrender.com";

  const [employee_code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  // đổi mật khẩu
  const [showChange, setShowChange] = useState(false);
  const [codeChange, setCodeChange] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  // ================= LOGIN =================
  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_code,
        password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setUser(data);
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  // ================= CHANGE PASSWORD =================
  const changePassword = async () => {
    if (!codeChange || !oldPass || !newPass) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    const res = await fetch(`${API}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_code: codeChange,
        old_password: oldPass,
        new_password: newPass,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Đổi mật khẩu thành công");
      setShowChange(false);
      setCodeChange("");
      setOldPass("");
      setNewPass("");
    } else {
      alert(data.message || "Đổi mật khẩu thất bại");
    }
  };

  // ================= PAGE =================
  if (user.page === "human_resource")
    return <HumanResource setUser={setUser} />;

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="bg-white shadow p-4 p-md-5 rounded-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h1
          className="text-center fw-bold mb-4"
          style={{
            color: "#0d6efd",
            fontSize: "34px",
          }}
        >
          ĐĂNG NHẬP
        </h1>

        <input
          className="form-control form-control-lg mb-3 rounded-3"
          placeholder="Mã nhân viên"
          value={employee_code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          type="password"
          className="form-control form-control-lg mb-3 rounded-3"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="btn btn-primary w-100 py-3 rounded-3 fw-semibold mb-3"
        >
          Đăng nhập
        </button>

        <button
          onClick={() => setShowChange(true)}
          className="btn btn-outline-secondary w-100 rounded-3"
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* MODAL ĐỔI PASS */}
      {showChange && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="mb-0">Đổi mật khẩu</h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowChange(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  placeholder="Mã nhân viên"
                  value={codeChange}
                  onChange={(e) =>
                    setCodeChange(e.target.value)
                  }
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Mật khẩu cũ"
                  value={oldPass}
                  onChange={(e) =>
                    setOldPass(e.target.value)
                  }
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Mật khẩu mới"
                  value={newPass}
                  onChange={(e) =>
                    setNewPass(e.target.value)
                  }
                />

                <button
                  onClick={changePassword}
                  className="btn btn-success w-100"
                >
                  Xác nhận đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;