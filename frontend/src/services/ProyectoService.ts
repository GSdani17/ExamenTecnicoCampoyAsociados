import axios from "axios";
import { Proyecto } from "../models/Proyecto";

const API_URL = "http://localhost:3000/api/proyectos";

export const getProyectos = async (params?: any): Promise<Proyecto[]> => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getProyectoById = async (id: number): Promise<Proyecto> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createProyecto = async (proyecto: Omit<Proyecto, "idProyecto">) => {
  await axios.post(API_URL, proyecto);
};

export const updateProyecto = async (id: number, proyecto: Omit<Proyecto, "idProyecto">) => {
  await axios.put(`${API_URL}/${id}`, proyecto);
};

export const deleteProyecto = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
