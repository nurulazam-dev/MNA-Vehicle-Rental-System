import express from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", vehiclesController.getVehicles);
router.get("/:vehicleId", vehiclesController.getVehicle);
router.post("/", auth("admin"), vehiclesController.createVehicle);
router.put("/:vehicleId", auth("admin"), vehiclesController.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteId);

export const vehicleRoutes = router;
