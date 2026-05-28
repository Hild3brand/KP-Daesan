import { useLocation } from "react-router-dom";

import { topbarTitle } from "./topbarTitle";
import { getUser, logout } from "../../utils/auth";

import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();

  const user = getUser();

  const title =
    topbarTitle[location.pathname] || "Page";

  return (
    <div className="topbar">

      {/* TITLE */}
      <p className="topbar-title">
        {title}
      </p>

      {/* USER */}
      <div className="topbar-user">
        <span>{user?.name}</span>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>

    </div>
  );
}