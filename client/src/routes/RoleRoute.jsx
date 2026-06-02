import { Navigate, Outlet } from "react-router-dom";

import { getRole } from "../utils/auth";

export default function RoleRoute({
  allowedRoles,
}) {
  const role = getRole();

  return allowedRoles.includes(role)
    ? <Outlet />
    : <Navigate to="/" replace />;
}