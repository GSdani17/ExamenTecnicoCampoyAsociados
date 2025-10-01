import React from "react";
import { useNavigate } from "react-router-dom";
import EmpleadoForm from "../components/EmpleadoForm";

import { Empleado } from "../models/Empleado";
import { createEmpleado } from "../services/EmpleadosService";

const AddEmpleadoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAdd = async (data: Omit<Empleado, "idEmpleado">) => {
    await createEmpleado(data);
    navigate("/"); 
  };

  return (
    <div>
      <h2>Agregar Empleado</h2>
      <EmpleadoForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddEmpleadoPage;