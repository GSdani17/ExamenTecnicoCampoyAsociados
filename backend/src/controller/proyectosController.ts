import { Request, Response } from "express";
import sql from "mssql";
import { getPool } from "../db/db";

export const getAllProyectos = async (req: Request, res: Response) => {
    try {
      const { nombreProyecto, fechaInicio, fechaFin } = req.query;
    console.log('fechaInicio :>> ', fechaInicio);
    console.log('fechaFin :>> ', fechaFin);
      const pool = await getPool();
      const result = await pool.request()
        .input("NombreProyecto", nombreProyecto || null)
        .input("FechaInicio", fechaInicio || null)
        .input("FechaFin", fechaFin || null)
        .execute("sp_GetProyectos");
  
      res.json(result.recordset);
    } catch (err: any) {
      console.error("Error ejecutando sp_GetProyectos:", err);
      res.status(500).json({
        message: "Error al obtener proyectos",
        error: err.message || err
      });
    }
  };

export const getProyectoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getPool();
        const result = await pool.request()
            .input("idProyecto", sql.Int, Number(id))
            .execute("sp_GetProyectoById");
        res.json(result.recordset[0] || null);
    } catch (err: any) {
        console.error("Error ejecutando sp_GetProyectoById:", err);
        res.status(500).json({ message: "Error al obtener proyecto", error: err.message || err });
    }
};

export const insertProyecto = async (req: Request, res: Response) => {
    try {
        const { NombreProyecto, Estatus,DuracionFechaInicio,DuracionFechaFin } = req.body;
        const pool = await getPool();
        const result = await pool.request()
            .input("NombreProyecto", sql.VarChar(50), NombreProyecto)
            .input("Estatus", sql.Bit, Estatus)
            .input("DuracionFechaInicio", sql.Date, DuracionFechaInicio)
            .input("DuracionFechaFin", sql.Date, DuracionFechaFin)
            .execute("sp_InsertProyecto");
        res.status(201).json({ idProyecto: result.recordset[0].idProyecto });
    } catch (err: any) {
        if (err.message.includes("Ya existe un proyecto")) {
            return res.status(400).json({ message: err.message });
          }
        console.error("Error ejecutando sp_InsertProyecto:", err);
        res.status(500).json({ message: "Error al insertar proyecto", error: err.message || err });
    }
};

export const updateProyecto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { NombreProyecto, Estatus ,DuracionFechaInicio, DuracionFechaFin} = req.body;
        const pool = await getPool();
        await pool.request()
            .input("idProyecto", sql.Int, Number(id))
            .input("NombreProyecto", sql.VarChar(50), NombreProyecto)
            .input("Estatus", sql.Bit, Estatus)
            .input("DuracionFechaInicio", sql.Date, DuracionFechaInicio)
            .input("DuracionFechaFin", sql.Date, DuracionFechaFin)
            .execute("sp_UpdateProyecto");
        res.json({ message: "Proyecto actualizado" });
    } catch (err: any) {
        if (err.message.includes("Ya existe un proyecto")) {
            return res.status(400).json({ message: err.message });
        }
        console.error("Error ejecutando sp_UpdateProyecto:", err);
        res.status(500).json({ message: "Error al actualizar proyecto", error: err.message || err });
    }
};

export const deleteProyecto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getPool();
        await pool.request()
            .input("idProyecto", sql.Int, Number(id))
            .execute("sp_DeleteProyecto");
        res.json({ message: "Proyecto eliminado" });
    } catch (err: any) {
        console.error("Error ejecutando sp_DeleteProyecto:", err);
        res.status(500).json({ message: "Error al eliminar proyecto", error: err.message || err });
    }
};