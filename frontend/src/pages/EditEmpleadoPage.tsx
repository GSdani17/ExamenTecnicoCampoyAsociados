import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmpleadoForm from "../components/EmpleadoForm";

import { Empleado } from "../models/Empleado";
import { getEmpleadoById, updateEmpleado } from "../services/EmpleadosService";

const EditEmpleadoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<Omit<Empleado, "idEmpleado"> | null>(null);

  useEffect(() => {
    if (id) {
      getEmpleadoById(Number(id)).then((emp) => {
        const fechaNac = emp.FechaNacimiento
          ? new Date(emp.FechaNacimiento).toISOString().split("T")[0]
          : "";
    
        const fechaAlta = emp.FechaAlta
          ? new Date(emp.FechaAlta).toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm
          : "";

        setEmpleado({
          Nombre: emp.Nombre,
          ApellidoPaterno: emp.ApellidoPaterno,
          ApellidoMaterno: emp.ApellidoMaterno,
          FechaNacimiento: fechaNac,
          FechaAlta: fechaAlta,
          Sueldo: emp.Sueldo,
          Estatus: emp.Estatus,
          Correo: emp.Correo,
          idProyecto: emp.idProyecto,
          NombreProyecto: emp.NombreProyecto,
        });
      });
    }
  }, [id]);

  const handleUpdate = async (data: Omit<Empleado, "idEmpleado">) => {
    if (id) {
      await updateEmpleado(Number(id), data);
      navigate("/");
    }
  };

  return empleado ? (
    <div>
      <h2>Editar Empleado</h2>
      <EmpleadoForm initialData={empleado} onSubmit={handleUpdate} />
    </div>
  ) : (
    <p>Cargando...</p>
  );
};

export default EditEmpleadoPage;