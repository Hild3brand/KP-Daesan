export const up = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(7) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      status ENUM('Active','Inactive') NOT NULL,
      refresh_token TEXT,
      roles_id INT NOT NULL,
      stage_code VARCHAR(2) NOT NULL,
      createdAt TIMESTAMP NULL,
      updatedAt TIMESTAMP NULL,

      CONSTRAINT fk_users_roles
        FOREIGN KEY (roles_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

      CONSTRAINT fk_users_stages
        FOREIGN KEY (stage_code)
        REFERENCES stages(stage_code)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.execute(`DROP TABLE users`);
};