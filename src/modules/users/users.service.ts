import { Request } from "express";
import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

const updateUser = async (req: Request, id: number) => {
  const { name, email, phone, role } = req.body;

  if (!["customer", "admin"].includes(role)) {
    throw Error("Role not match");
  }

  let newRole;
  if (req.user?.role === "customer") {
    newRole = "customer";
  } else {
    newRole = role;
  }

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role`,
    [name, email, phone, newRole, id]
  );

  return result;
};

const deleteUser = async (id: number) => {
  const booking = await pool.query(
    `SELECT status FROM bookings WHERE customer_id=$1 AND status='active' LIMIT 1`,
    [id]
  );

  if (booking.rows.length > 0) {
    throw new Error("This user booking already exist");
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

  if (result.rowCount === 0) {
    throw new Error("User not found");
  }

  return result;
};

export const userService = {
  getUsers,
  updateUser,
  deleteUser,
};
