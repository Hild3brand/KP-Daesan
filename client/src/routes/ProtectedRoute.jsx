import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  isAuthenticated,
  getUser,
} from "../utils/auth";

export default function ProtectedRoute() {
  const location = useLocation();

  // BELUM LOGIN
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const user = getUser();

  // JIKA USER TIDAK ADA
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const path = location.pathname;

  const currentRole = path.split("/")[1];

  const userRole =
    user.role_name?.toLowerCase();

  // CEGAH AKSES ROLE LAIN
  if (
    currentRole &&
    currentRole !== userRole
  ) {
    return (
      <Navigate
        to={`/${userRole}/dashboard`}
        replace
      />
    );
  }

  return <Outlet />;
}