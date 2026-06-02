import { getUser } from "../../../utils/auth";

export default function AdminDashboard() {
  const user = getUser();

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
        }}
      >
        <h3>User Information</h3>

        <p>
          <strong>ID:</strong> {user.id}
        </p>

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Role:</strong> {user.role_name}
        </p>
      </div>
    </div>
  );
}