import axios from "axios";
import { Empleado } from "../models/Empleado";

const API_URL = "http://localhost:3000/api/empleados";

// export const getEmpleados = async (params: any): Promise<Empleado[]> => {
//   console.log('params :>> ', params);
//   const res = await axios.get(API_URL);
//   return res.data;
// };
export const getEmpleados = async (filters?: {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  edadMin?: string | number;
  edadMax?: string | number;
  idProyecto?: number;
}): Promise<Empleado[]> => {
  const params: any = {};
  
  if (filters) {
    if (filters.nombre?.trim()) params.nombre = filters.nombre.trim();
    if (filters.apellidoPaterno?.trim()) params.apellidoPaterno = filters.apellidoPaterno.trim();
    if (filters.apellidoMaterno?.trim()) params.apellidoMaterno = filters.apellidoMaterno.trim();
    if (filters.edadMin) params.edadMin = Number(filters.edadMin);
    if (filters.edadMax) params.edadMax = Number(filters.edadMax);
    if (filters.idProyecto && filters.idProyecto !== 0) params.idProyecto = filters.idProyecto;
  }

  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getEmpleadoById = async (id: number): Promise<Empleado> => {

  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createEmpleado = async (empleado: Omit<Empleado, "idEmpleado">) => {
    const res = await axios.post(API_URL, empleado);
    return res.data;
  };
  
  export const updateEmpleado = async (id: number, empleado: Omit<Empleado, "idEmpleado">) => {
    const res = await axios.put(`${API_URL}/${id}`, empleado);
    return res.data;
  };

export const deleteEmpleado = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
