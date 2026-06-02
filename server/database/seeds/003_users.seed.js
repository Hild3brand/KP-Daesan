import bcrypt from "bcrypt";

export default async (db) => {
  const password = await bcrypt.hash("123456", 10);

  const users = [
    // ================= ADMIN =================
    {
      id: "2210001",
      name: "Admin One",
      password,
      status: "Active",
      roles_id: 1,
      stage_code: "R1"
    },
    {
      id: "2210002",
      name: "Admin Two",
      password,
      status: "Active",
      roles_id: 1,
      stage_code: "R1"
    },

    // ================= TEACHER =================
    {
      id: "2210003",
      name: "Teacher One",
      password,
      status: "Active",
      roles_id: 2,
      stage_code: "R1"
    },
    {
      id: "2210004",
      name: "Teacher Two",
      password,
      status: "Active",
      roles_id: 2,
      stage_code: "R1"
    },

    // ================= STUDENT =================
    {
      id: "2210005",
      name: "Student One",
      password,
      status: "Active",
      roles_id: 3,
      stage_code: "R1"
    },
    {
      id: "2210006",
      name: "Student Two",
      password,
      status: "Active",
      roles_id: 3,
      stage_code: "R1"
    }
  ];

  for (const u of users) {
    await db.query(
      `INSERT INTO users 
      (id, name, password, status, roles_id, stage_code)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = name`,
      [u.id, u.name, u.password, u.status, u.roles_id, u.stage_code]
    );
  }

  console.log("Users seeded");
};