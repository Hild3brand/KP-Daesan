import { createBrowserRouter } from "react-router-dom";

/* LAYOUT */
import MainLayout from "../layouts/MainLayout";

/* ROUTES */
import ProtectedRoute from "../routes/ProtectedRoute";
import PretestDoneRoute from "../routes/PretestDoneRoute";
import RoleRoute from "../routes/RoleRoute";
import PretestRoute from "../routes/PretestRoute";

/* AUTH */
import Login from "../pages/auth/Login";

/* ADMIN */
import AdminDashboard from "../pages/admin/dashboard/Dashboard";
import UserManagement from "../pages/admin/users/UserManagement";

/* TEACHER */
import TeacherDashboard from "../pages/teacher/dashboard/Dashboard";

/* STUDENT */
import StudentDashboard from "../pages/student/dashboard/Dashboard";
import Pretest from "../pages/student/pretest/Pretest";
import Chatbot from "../pages/student/chatbot/Chatbot";

const router = createBrowserRouter([
  
  /* LOGIN */
  {
    path: "/",
    element: <Login />,
  },

  /* PROTECTED */
  {
    element: <ProtectedRoute />,
    children: [

      /* MAIN LAYOUT */
      {
        element: <MainLayout />,
        children: [

          /* ADMIN */
          {
            element: (
              <RoleRoute
                allowedRoles={[1]}
              />
            ),

            children: [
              {
                path: "/admin/dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "/admin/users",
                element: <UserManagement />,
              },
            ],
          },

          /* TEACHER */
          {
            element: (
              <RoleRoute
                allowedRoles={[2]}
              />
            ),

            children: [
              {
                path: "/teacher/dashboard",
                element: <TeacherDashboard />,
              },
            ],
          },

          /* STUDENT */
          {
            element: (
              <RoleRoute
                allowedRoles={[3]}
              />
            ),

            children: [
              {
                path: "/student/dashboard",
                element: <StudentDashboard />,
              },
              {
                path: "/student/pretest",
                element: (
                  <PretestRoute>
                    <Pretest />
                  </PretestRoute>
                ),
              },
              {
                path: "/student/chatbot",
                element: (
                  <PretestDoneRoute>
                    <Chatbot />
                  </PretestDoneRoute>
                ),
              },
            ],
          },

        ],
      },
    ],
  },

]);

export default router;