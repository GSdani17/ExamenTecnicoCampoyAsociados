import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getPool } from "../db/db";
import sql from "mssql";

const JWT_SECRET = "mi_secreto_super_seguro"; // Usar el mismo que en middleware

interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  password: string; 
}

export const login = async (req: Request, res: Response) => {
  const { nombreUsuario, password } = req.body;

  if (!nombreUsuario || !password) {
    return res.status(400).json({ message: "Usuario y contraseña requeridos" });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("nombreUsuario", sql.VarChar(50), nombreUsuario)
      .input("password", sql.VarChar(50), password)
      .execute("sp_GetUsuarioPorNombre");

    const usuario: Usuario | undefined = result.recordset[0]
      ? {
          idUsuario: result.recordset[0].idUsuario,
          nombreUsuario: result.recordset[0].nombreUsuario,
          password: result.recordset[0].Contraseña, 
        }
      : undefined;

    if (!usuario) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, nombreUsuario: usuario.nombreUsuario },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err: any) {
    console.error("Error login:", err);
    res.status(500).json({ message: "Error al autenticar usuario" });
  }
};