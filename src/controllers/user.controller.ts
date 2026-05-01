import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { createActivityLog } from "../services/activityLog.service";

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

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'editor'
    });

    // Excluir la contraseña de la respuesta
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    // Registrar actividad
    const creator = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: creator?.email || 'unknown',
      action: 'Creó usuario',
      section: 'usuarios',
      details: `Nuevo usuario creado: ${email} con rol ${role || 'editor'}`,
    });

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getUser = async (req: any, res: Response): Promise<void> => {
  const userId = req.userId; // Use req.userId

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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).params.id || (req as any).userId;
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

    // Registrar actividad
    const updater = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: updater?.email || 'unknown',
      action: 'Editó usuario',
      section: 'usuarios',
      details: `Usuario ${user.email} actualizado`,
    });

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Añadir método para eliminar usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).params.id || (req as any).userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userEmail = user.email;
    await user.destroy();

    // Registrar actividad
    const deleter = await User.findByPk((req as any).userId);
    await createActivityLog({
      user: deleter?.email || 'unknown',
      action: 'Eliminó usuario',
      section: 'usuarios',
      details: `Usuario eliminado: ${userEmail}`,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};