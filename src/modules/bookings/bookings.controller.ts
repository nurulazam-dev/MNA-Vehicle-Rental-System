import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req);

    res.status(201).send({
      success: true,
      message: "Booking create successfully",
      data: {
        ...result.result,
        vehicle: result.vehicle,
      },
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getBookings(req);

    res.status(200).send({
      success: true,
      message: "Bookings fetch successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.bookingId);
    const result = await bookingService.updateBooking(req, id);

    res.status(200).send({
      success: true,
      message:
        req.user?.role === "customer"
          ? "Booking Update successfully"
          : "Vehicle is available for booking",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
