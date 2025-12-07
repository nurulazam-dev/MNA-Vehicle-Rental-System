import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  DB_CONNECT_URL: process.env.DB_CONNECT_URL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
