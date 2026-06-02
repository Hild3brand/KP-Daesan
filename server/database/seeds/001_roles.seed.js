export default async (db) => {
  const roles = [
    { name: "Admin" },
    { name: "Teacher" },
    { name: "Student" }
  ];

  for (const role of roles) {
    await db.query(
      "INSERT INTO roles (name) VALUES (?) ON DUPLICATE KEY UPDATE name = name",
      [role.name]
    );
  }

  console.log("Roles seeded");
};