import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";

export default function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div style={{  flex: 1, display: "flex", flexDirection: "column", marginLeft: "15%", }}>
        {/* TOPBAR */}
        <Topbar />

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto", }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}