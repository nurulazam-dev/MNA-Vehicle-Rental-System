import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.DB_CONNECT_URL}`,
});

const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE CHECK(email = LOWER(email)),
        password TEXT NOT NULL CHECK(LENGTH(password) >= 6),
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin','customer')) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC  NOT NULL CHECK(daily_rent_price > 0),
        availability_status TEXT CHECK (availability_status IN ('available','booked')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
        total_price NUMERIC CHECK(total_price > 0) NOT NULL,
        status VARCHAR(60) NOT NULL CHECK (status IN ('active','cancelled','returned')) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

export default init;
