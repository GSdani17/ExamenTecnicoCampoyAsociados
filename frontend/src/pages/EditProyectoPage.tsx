import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProyectoForm from "../components/ProyectoForm";
import { Proyecto } from "../models/Proyecto";
import { getProyectoById, updateProyecto } from "../services/ProyectoService";

const EditProyectoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<Omit<Proyecto, "idProyecto"> | null>(null);

  useEffect(() => {
    if (id) {
      getProyectoById(Number(id)).then((p) => {
        const DuracionFechaInicio = p.DuracionFechaInicio
          ? new Date(p.DuracionFechaInicio).toISOString().split("T")[0]
          : "";

        const DuracionFechaFin = p.DuracionFechaFin
          ? new Date(p.DuracionFechaFin).toISOString().split("T")[0]
          : "";

        setProyecto({
          NombreProyecto: p.NombreProyecto,
          Estatus: p.Estatus,
          DuracionFechaInicio,
          DuracionFechaFin
        });
      });
    }
  }, [id]);

  const handleUpdate = async (data: Omit<Proyecto, "idProyecto">) => {
    if (id) {
      await updateProyecto(Number(id), data);
      navigate("/proyectos");
    }
  };

  return proyecto ? (
    <div>
      <h2>Editar Proyecto</h2>
      <ProyectoForm initialData={proyecto} onSubmit={handleUpdate} mode="edit" /> 
    </div>
  ) : (
    <p>Cargando...</p>
  );
};

export default EditProyectoPage;