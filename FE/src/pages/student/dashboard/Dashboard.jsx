import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../../services/api";

import { getUser } from "../../../utils/auth";

import "./Dashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  const [hasPretest, setHasPretest] =
    useState(false);

  useEffect(() => {
    fetchUser();
    checkPretest();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");

      setUserData(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const checkPretest = async () => {
    try {
      const res = await API.get(
        "/pretest/check"
      );

      setHasPretest(
        res.data.hasPretest
      );

    } catch (err) {
      console.error(err);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>

      <h1>Student Dashboard</h1>

      <div className="student-dashboard-grid">

        {/* STUDENT INFO */}
        <div className="student-card">

          <h3>Student Information</h3>

          <hr />

          <p>
            <strong>ID:</strong>{" "}
            {userData.id}
          </p>

          <p>
            <strong>Name:</strong>{" "}
            {userData.name}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {userData.role_name}
          </p>

        </div>

        {/* CURRENT STAGE */}
        <div className="student-card stage-card">

          <h3>Current Stage</h3>

          <hr style={{ color:"#CCCCCC", width:"100%" }}/>

          <div className="stage-badge">
            {hasPretest
              ? userData.stage_code
              : "?"}
          </div>

          <p className="stage-name">
            {hasPretest
              ? userData.stage_name
              : "Complete Pretest First"}
          </p>

        </div>

      </div>

      {/* PRETEST CARD */}
      {!hasPretest && (
        <div className="student-card pretest-card">

          <h2>Pretest</h2>

          <hr />

          <p>
            Anda belum mengerjakan
            pretest, harap kerjakan
            pretest terlebih dahulu
            sebelum menggunakan chatbot.
          </p>

          <button
            className="pretest-btn-dashboard"
            onClick={() =>
              navigate(
                "/student/pretest"
              )
            }
          >
            Start Pretest
          </button>

        </div>
      )}

    </div>
  );
}