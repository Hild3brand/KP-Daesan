import { getUser } from "../../../utils/auth";

export default function TeacherDashboard() {
  const user = getUser();

  return (
    <div>
      <h1>Teacher Dashboard</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
        }}
      >
        <h3>Teacher Information</h3>

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