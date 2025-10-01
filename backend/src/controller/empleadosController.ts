import { Request, Response } from "express";
import sql from "mssql";
import { getPool } from "../db/db";

export const getAllEmpleados = async (req: Request, res: Response) => {
    try {
        const { nombre, apellidoPaterno, apellidoMaterno, edadMin, edadMax, idProyecto } = req.query;
    
        const pool = await getPool();
        const result = await pool.request()
          .input("Nombre", sql.VarChar(50), nombre || null)
          .input("ApellidoPaterno", sql.VarChar(50), apellidoPaterno || null)
          .input("ApellidoMaterno", sql.VarChar(50), apellidoMaterno || null)
          .input("EdadMin", sql.Int, edadMin ? Number(edadMin) : null)
          .input("EdadMax", sql.Int, edadMax ? Number(edadMax) : null)
          .input("idProyecto", sql.Int, idProyecto ? Number(idProyecto) : null) 
          .execute("sp_GetEmpleados");
    
        res.json(result.recordset);
      } catch (err: any) {
        console.error("Error ejecutando sp_GetEmpleados:", err);
        res.status(500).json({
          message: "Error al obtener empleados",
          error: err.message || err
        });
      }
    };
export const getEmpleadoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getPool();
        const result = await pool.request()
            .input("idEmpleado", sql.Int, Number(id))
            .execute("sp_GetEmpleadoById");
        res.json(result.recordset[0] || null);
    } catch (err: any) {
        console.error("Error ejecutando sp_GetEmpleadoById:", err);
        res.status(500).json({
            message: "Error al obtener empleado",
            error: err.message || err
        });
    }
};

export const deleteEmpleado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('req.params :>> ', req.params);
        const pool = await getPool();
        await pool.request()
            .input("idEmpleado", sql.Int, Number(id))
            .execute("sp_DeleteEmpleado");
        res.json({ message: "Empleado eliminado" });
    } catch (err: any) {
        console.error("Error ejecutando sp_DeleteEmpleado:", err);
        res.status(500).json({
            message: "Error al eliminar empleado",
            error: err.message || err
        });
    }
};

export const insertEmpleado = async (req: Request, res: Response) => {
    try {
        const {
            Nombre,
            ApellidoPaterno,
            ApellidoMaterno,
            FechaNacimiento,
            // FechaAlta,
            Sueldo,
            // Estatus,
            Correo,
            idProyecto
        } = req.body;

        const pool = await getPool();
        const result = await pool.request()
            .input("Nombre", sql.VarChar(50), Nombre)
            .input("ApellidoPaterno", sql.VarChar(50), ApellidoPaterno)
            .input("ApellidoMaterno", sql.VarChar(50), ApellidoMaterno)
            .input("FechaNacimiento", sql.Date, FechaNacimiento)
            // .input("FechaAlta", sql.DateTime, FechaAlta)
            .input("Sueldo", sql.Numeric(10,2), Sueldo)
            // .input("Estatus", sql.Bit, Estatus)
            .input("Correo", sql.VarChar(50), Correo)
            .input("idProyecto", sql.Int, idProyecto)
            .execute("sp_InsertEmpleado");

        res.status(201).json({ idEmpleado: result.recordset[0].idEmpleado });
    } catch (err: any) {
        if (err.message.includes("Ya existe un empleado")) {
            return res.status(400).json({ message: err.message });
          }
        console.error("Error ejecutando sp_InsertEmpleado:", err);
        res.status(500).json({
            message: "Error al insertar empleado",
            error: err.message || err
        });
    }
};

export const updateEmpleado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            Nombre,
            ApellidoPaterno,
            ApellidoMaterno,
            FechaNacimiento,
            FechaAlta,
            Sueldo,
            Estatus,
            Correo,
            idProyecto
        } = req.body;

        const pool = await getPool();
        await pool.request()
            .input("idEmpleado", sql.Int, Number(id))
            .input("Nombre", sql.VarChar(50), Nombre)
            .input("ApellidoPaterno", sql.VarChar(50), ApellidoPaterno)
            .input("ApellidoMaterno", sql.VarChar(50), ApellidoMaterno)
            .input("FechaNacimiento", sql.Date, FechaNacimiento)
            .input("FechaAlta", sql.DateTime, FechaAlta)
            .input("Sueldo", sql.Numeric(10,2), Sueldo)
            .input("Estatus", sql.Bit, Estatus)
            .input("Correo", sql.VarChar(50), Correo)
            .input("idProyecto", sql.Int, idProyecto)
            .execute("[sp_UpdateEmpleado]");

        res.json({ message: "Empleado actualizado" });
    } catch (err: any) {
        if (err.message.includes("Ya existe un empleado")) {
            return res.status(400).json({ message: err.message });
        }
        console.error("Error ejecutando sp_UpdateEmpleadoValidado:", err);
        res.status(500).json({ message: "Error al actualizar empleado", error: err.message || err });
    }
};