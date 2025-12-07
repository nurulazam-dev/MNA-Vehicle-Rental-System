import express from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.get("/", auth(), bookingController.getBookings);
router.post("/", auth(), bookingController.createBooking);
router.put("/:bookingId", auth(), bookingController.updateBooking);

export const bookingRoutes = router;
