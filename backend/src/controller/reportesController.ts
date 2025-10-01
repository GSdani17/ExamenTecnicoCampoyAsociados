import { Request, Response } from "express";
import { getPool } from "../db/db";

export const getEmpleadosActivos = async (req: Request, res: Response) => {
    try {
        const pool = await getPool();
        const result = await pool.request().execute("sp_GetEmpleadosActivosReport");

        res.json(result.recordset); 
    } catch (err: any) {
        console.error("Error en sp_GetEmpleadosActivosReport:", err);
        res.status(500).json({
            message: "Error al obtener empleados activos",
            error: err.message || err
        });
    }
};

export const getEmpleadosPorProyecto = async (req: Request, res: Response) => {
    try {
        const pool = await getPool();
        const result = await pool.request().execute("sp_GetEmpleadosPorProyectoReport");

        const data = result.recordset.reduce((acc: any, row: any) => {
            if (!acc[row.NombreProyecto]) {
                acc[row.NombreProyecto] = [];
            }
            if (row.idEmpleado) {
                acc[row.NombreProyecto].push({
                    idEmpleado: row.idEmpleado,
                    NombreCompleto: row.NombreCompleto,
                    Correo: row.Correo
                });
            }
            return acc;
        }, {});

        res.json(data);
    } catch (err: any) {
        console.error("Error en sp_GetEmpleadosPorProyectoReport:", err);
        res.status(500).json({
            message: "Error al obtener empleados por proyecto",
            error: err.message || err
        });
    }
};

export const getProyectosActivos = async (req: Request, res: Response) => {
    try {
      const pool = await getPool();
      const result = await pool.request().execute("sp_GetProyectosActivosReport");
      res.json(result.recordset);
    } catch (err: any) {
      console.error("Error ejecutando sp_GetProyectosActivos:", err);
      res.status(500).json({ message: "Error al obtener proyectos activos", error: err.message || err });
    }
  };