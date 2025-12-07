import { Request } from "express";
import { pool } from "../../config/db";

const createVehicle = async (req: Request) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  if (!["car", "bike", "van", "SUV"].includes(type)) {
    throw new Error("Types not found");
  }

  if (Number(daily_rent_price) < 0) {
    throw new Error("Not accept negative price");
  }

  if (!["available", "booked"].includes(availability_status)) {
    throw new Error("Invalid availability status");
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type,registration_number, daily_rent_price,availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const updateVehicle = async (req: Request, id: number) => {
  const { vehicle_name, daily_rent_price, availability_status } = req.body;

  if (Number(daily_rent_price) < 0) {
    throw new Error("Not accept negative price");
  }

  if (!["available", "booked"].includes(availability_status)) {
    throw new Error("Invalid availability status");
  }

  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, daily_rent_price=$2, availability_status=$3 WHERE id=$4 RETURNING id,vehicle_name,type,registration_number, daily_rent_price,availability_status`,
    [vehicle_name, daily_rent_price, availability_status, id]
  );

  result.rows.forEach(
    (item) => (item.daily_rent_price = Number(item.daily_rent_price))
  );

  return result;
};

const getVehicles = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type,registration_number, daily_rent_price,availability_status FROM vehicles`
  );

  result.rows.forEach(
    (item) => (item.daily_rent_price = Number(item.daily_rent_price))
  );

  return result;
};

const getVehicle = async (id: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type,registration_number, daily_rent_price,availability_status FROM vehicles WHERE id=$1`,
    [id]
  );

  result.rows.forEach(
    (item) => (item.daily_rent_price = Number(item.daily_rent_price))
  );

  return result;
};

const deleteId = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);

  if (result.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  result.rows.forEach(
    (item) => (item.daily_rent_price = Number(item.daily_rent_price))
  );

  return result;
};

export const vehiclesService = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteId,
};
