import React from "react";
import { useNavigate } from "react-router-dom";
import ProyectoForm from "../components/ProyectoForm";
import { Proyecto } from "../models/Proyecto";
import { createProyecto } from "../services/ProyectoService";

const AddProyectoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAdd = async (data: Omit<Proyecto, "idProyecto">) => {
    await createProyecto(data);
    navigate("/proyectos");
  };

  return (
    <div>
      <h2>Agregar Proyecto</h2>
      <ProyectoForm onSubmit={handleAdd} mode="add" /> 
    </div>
  );
};

export default AddProyectoPage;
