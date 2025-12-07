import { Request } from "express";
import { pool } from "../../config/db";

const createBooking = async (req: Request) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  const isValidDateRange = startDate <= endDate;

  if (!isValidDateRange) {
    throw new Error("Invalid date ranger");
  }

  const totalDay = Math.ceil(
    Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const vehicleRows = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicle_id]
  );

  if (vehicleRows.rows.length === 0) {
    throw new Error("Vehicle not available for booking");
  }

  let vehicle = {
    vehicle_name: vehicleRows.rows[0].vehicle_name,
    daily_rent_price: vehicleRows.rows[0].daily_rent_price,
  };

  const totalPrice =
    Number(vehicleRows.rows[0]?.daily_rent_price) * Number(totalDay);

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      totalPrice,
      "active",
    ]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    result: result.rows[0],
    vehicle,
  };
};

const getBookings = async (req: Request) => {
  const { user } = req;

  const mainQuery = `SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings `;

  const query =
    user?.role === "admin" ? mainQuery : `${mainQuery} WHERE customer_id=$1`;

  const params = user?.role === "admin" ? [] : [user?.id];

  const result = await pool.query(query, params);

  const getCustomer = async (customerId: number) => {
    const res = await pool.query(`SELECT name, email FROM users WHERE id=$1`, [
      customerId,
    ]);
    return res.rows[0];
  };

  const getVehicle = async (vehicleId: number) => {
    const res = await pool.query(
      `SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1`,
      [vehicleId]
    );
    return res.rows[0];
  };

  const bookings = await Promise.all(
    result.rows.map(async (row) => {
      const vehicle = await getVehicle(row.vehicle_id);

      const customer =
        user?.role === "admin" ? await getCustomer(row.customer_id) : undefined;

      return {
        ...row,
        ...(customer && { customer }),
        vehicle,
      };
    })
  );

  return bookings;
};

const updateBooking = async (req: Request, bookingId: number) => {
  const { user } = req;
  const { status } = req.body;

  if (user?.role === "admin" && status !== "returned") {
    throw new Error("status only use 'returned'");
  }

  if (user?.role === "customer" && status !== "cancelled") {
    throw new Error("status on use 'cancelled'");
  }

  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (bookingRes.rows.length === 0) throw new Error("Booking not found");

  const booking = bookingRes.rows[0];

  if (user?.role === "customer") {
    const today = new Date();

    if (today >= new Date(booking.rent_start_date)) {
      throw new Error("Not possible after booking start date");
    }
  }

  const updatedBookingRes = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status`,
    [status, bookingId]
  );

  let vehicleInfo = null;

  if (user?.role === "admin" && status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    const vehicleRes = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id=$1`,
      [booking.vehicle_id]
    );
    vehicleInfo = vehicleRes.rows[0];
  }

  return {
    ...updatedBookingRes.rows[0],
    ...(vehicleInfo ? { vehicle: vehicleInfo } : {}),
  };
};

export const bookingService = {
  createBooking,
  getBookings,
  updateBooking,
};
