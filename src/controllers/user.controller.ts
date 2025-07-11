import { Request, Response } from "express";
import User from "../models/user.model";

// Obtener TU usuario (/users/me)
export const getUser = async (req: any, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Actualizar TU usuario (/users/me)
export const updateUser = async (req: any, res: Response): Promise<void> => {
  const userId = req.userId;
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Eliminar TU usuario (/users/me)
export const deleteUser = async (req: any, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Obtener TODOS los usuarios (admin) (/users)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Actualizar usuario por id (admin) (/users/:id)
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Eliminar usuario por id (admin) (/users/:id)
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
