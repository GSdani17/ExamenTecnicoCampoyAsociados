import React, { useEffect, useState } from "react";
import { Empleado } from "../models/Empleado";
import { Proyecto } from "../models/Proyecto";

const ReportesPage: React.FC = () => {
  const [empleadosActivos, setEmpleadosActivos] = useState<Empleado[]>([]);
  const [empleadosPorProyecto, setEmpleadosPorProyecto] = useState<any>({});
  const [proyectosActivos, setProyectosActivos] = useState<Proyecto[]>([]);

  useEffect(() => {
    // Empleados activos
    fetch("http://localhost:3000/api/reportes/empleadosActivos")
      .then(res => res.json())
      .then(setEmpleadosActivos)
      .catch(err => console.error(err));

    // Empleados por proyecto
    fetch("http://localhost:3000/api/reportes/empleadosPorProyecto")
      .then(res => res.json())
      .then(setEmpleadosPorProyecto)
      .catch(err => console.error(err));

    // Proyectos activos
    fetch("http://localhost:3000/api/reportes/proyectosActivos")
      .then(res => res.json())
      .then(setProyectosActivos)
      .catch(err => console.error(err));
  }, []);

  const proyectosArray = Object.entries(empleadosPorProyecto).map(
    ([NombreProyecto, Empleados]) => ({
      NombreProyecto,
      Empleados,
    })
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📊 Reportes</h2>

      {/* 🔹 Empleados activos */}
      <div className="card mb-4 shadow border-primary">
        <div className="card-header bg-primary text-white fw-bold">
          👨‍💼 Empleados Activos
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Proyecto</th>
              </tr>
            </thead>
            <tbody>
              {empleadosActivos.map(emp => (
                <tr key={emp.idEmpleado}>
                  <td>{`${emp.Nombre} ${emp.ApellidoPaterno} ${emp.ApellidoMaterno}`}</td>
                  <td>{emp.Correo}</td>
                  <td>{emp.NombreProyecto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Empleados por proyecto */}
      <div className="card mb-4 shadow border-success">
        <div className="card-header bg-success text-white fw-bold">
          🏢 Empleados por Proyecto
        </div>
        <div className="card-body">
          {proyectosArray.map((proj) => (
            <div key={proj.NombreProyecto} className="mb-3">
              <strong className="text-success">{proj.NombreProyecto}:</strong>
              <ul className="list-group list-group-flush mt-1">
                {Array.isArray(proj.Empleados) &&
                  proj.Empleados.map((e: any) => (
                    <li key={e.idEmpleado} className="list-group-item">
                      {e.NombreCompleto}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Proyectos activos */}
      <div className="card mb-4 shadow border-info">
        <div className="card-header bg-info text-white fw-bold">
          📌 Proyectos Activos
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-info">
              <tr>
                <th>Nombre Proyecto</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
              </tr>
            </thead>
            <tbody>
              {proyectosActivos.map(proj => (
                <tr key={proj.idProyecto}>
                  <td>{proj.NombreProyecto}</td>
                  <td>{new Date(new Date(proj.DuracionFechaInicio).getTime() + 24*60*60*1000).toLocaleDateString()}</td>
                  <td>{new Date(new Date(proj.DuracionFechaFin).getTime() + 24*60*60*1000).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;