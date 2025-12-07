import { Request } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const login = async (req: Request) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT id, name, email, password, phone, role FROM users WHERE email=$1`,
    [email]
  );

  const comparePassword = await bcrypt.compare(
    password,
    result.rows[0]?.password
  );

  if (!comparePassword) {
    throw new Error("Wrong Password");
  }

  delete result.rows[0].password;
  return result;
};

const signup = async (req: Request) => {
  const { name, email, password, phone, role = "customer" } = req.body;

  if (password?.length < 6) {
    throw Error("Password min 6 characters");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const lowerCaseEmail = String(email).toLowerCase();

  if (!["customer", "admin"].includes(role)) {
    throw Error("Role not match");
  }

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, lowerCaseEmail, hashPassword, phone, role]
  );
  return result;
};

export const authService = {
  login,
  signup,
};
