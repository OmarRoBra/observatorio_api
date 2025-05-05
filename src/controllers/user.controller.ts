import { Request, response, Response } from "express";
import User from "../models/user.model";
import { promises } from "dns";

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

export const updateUser = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

/* export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    // Opcional: validar que solo un admin pueda crear
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden: Only admins can create users' });
      return;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con rol (por defecto 'user' si no se envía)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role && ['admin','user'].includes(role) ? role : 'user',
    });

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
}; */
