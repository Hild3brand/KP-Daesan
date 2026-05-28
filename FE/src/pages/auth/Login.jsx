import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import { saveAuth } from "../../utils/auth";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // LOGIN
      const res = await API.post("/auth/login", form);

      const { accessToken, refreshToken } = res.data;

      // GET USER
      const userRes = await API.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = userRes.data;

      // SAVE AUTH
      saveAuth({
        accessToken,
        refreshToken,
        user,
      });

      // REDIRECT
        if (user.role_id === 1) {
          navigate("/admin/dashboard");
        }

        if (user.role_id === 2) {
          navigate("/teacher/dashboard");
        }

        if (user.role_id === 3) {
          navigate("/student/dashboard");
        }

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login gagal"
      );
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">

        {/* LOGO */}
        <div className="login-logo">
          <img
            src="/images/logo/daesan_orange_logo.png"
            alt="Daesan Logo"
          />

          <p>daesan</p>
        </div>

        {/* IMAGE */}
        <div className="login-image">
          <img
            src="/images/login/daesan_display_login.png"
            alt="Display"
          />
        </div>

        <div />

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        {/* LOGIN BOX */}
        <div className="login-box">

          <p className="login-title">
            Korean Class
          </p>

          <p className="login-subtitle">
            LEARNING MANAGEMENT SYSTEM
          </p>

          <hr />

          <form onSubmit={handleLogin}>

            {/* USER ID */}
            <input
              type="text"
              name="id"
              placeholder="User ID"
              value={form.id}
              onChange={handleChange}
              className="login-input"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="login-input"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}