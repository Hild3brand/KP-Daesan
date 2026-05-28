import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const baseDb = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true
}).promise();

const initDatabase = async () => {
  await baseDb.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );
};

await initDatabase();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

export default db.promise();