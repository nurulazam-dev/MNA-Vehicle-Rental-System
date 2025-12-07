import express, { Request, Response } from "express";
import init from "./config/db";
import { userRoutes } from "./modules/users/users.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import notFoundRoute from "./middleware/notFound";

const app = express();

app.use(express.json());
init();

app.get("/", (req: Request, res: Response) => {
  res.send("MNA-Vehicle-Rental-Management server run");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// 404 route
app.use(notFoundRoute);

export default app;
