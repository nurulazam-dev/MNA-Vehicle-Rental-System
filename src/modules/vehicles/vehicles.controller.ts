import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.createVehicle(req);

    res.status(201).send({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    const result = await vehiclesService.updateVehicle(req, id);

    res.status(200).send({
      success: true,
      message: "Vehicle update successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getVehicles();

    res.status(200).send({
      success: true,
      message:
        result.rows.length === 0
          ? "Vehicles not found"
          : "Vehicles fetch successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    const result = await vehiclesService.getVehicle(id);

    res.status(200).send({
      success: true,
      message:
        result.rows.length === 0
          ? "Vehicle not found"
          : "Vehicle fetch successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const deleteId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    await vehiclesService.deleteId(id);

    res.status(200).send({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

export const vehiclesController = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteId,
};
