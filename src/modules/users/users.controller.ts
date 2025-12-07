import { Request, Response } from "express";
import { userService } from "./users.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();

    res.status(200).send({
      success: true,
      message: "Users fetch successfully",
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const paramId = Number(req.params.userId);
    const userId = Number(req.user?.id);
    const role = req.user?.role;

    if (role !== "admin" && paramId !== userId) {
      throw new Error("Can't access data");
    }

    const id = role === "admin" ? paramId : userId;
    const result = await userService.updateUser(req, id);

    res.status(200).send({
      success: true,
      message: "User update successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);
    const result = await userService.deleteUser(id);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User Delete successfully",
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
};
