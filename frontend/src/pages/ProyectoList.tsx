import React, { useEffect, useState } from "react";
import { Proyecto } from "../models/Proyecto";
import { Link } from "react-router-dom";
import { deleteProyecto, getProyectos } from "../services/ProyectoService";

const ProyectoList: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [filters, setFilters] = useState({
    nombreProyecto: "",
    fechaInicio: "",
    fechaFin: ""
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async (params?: any) => {
    const data = await getProyectos(params);
    setProyectos(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (
      filters.fechaInicio &&
      filters.fechaFin &&
      filters.fechaInicio > filters.fechaFin
    ) {
      alert("La fecha de inicio no puede ser mayor que la fecha final.");
      return;
    }
    fetchProyectos(filters);
  };

  const handleReset = () => {
    setFilters({ nombreProyecto: "", fechaInicio: "", fechaFin: "" });
    fetchProyectos();
  };

  const handleDelete = async (id: number) => {
    await deleteProyecto(id);
    setProyectos(proyectos.filter((p) => p.idProyecto !== id));
  };

  const formatDate = (isoDate: string | undefined) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate() + 1).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Proyectos</h2>
        <Link to="/proyectos/add" className="btn btn-success">
          Agregar Proyecto
        </Link>
      </div>

      {!showAdvanced && (
        <div className="mb-3">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAdvanced(true)}
          >
            Búsqueda Avanzada
          </button>
        </div>
      )}

      {showAdvanced && (
        <div className="card card-body mb-3">
          <div className="row g-3">
            <div className="col-md-4 form-floating">
              <input
                type="text"
                id="nombreProyecto"
                name="nombreProyecto"
                value={filters.nombreProyecto}
                onChange={handleChange}
                className="form-control"
                placeholder="Nombre Proyecto"
              />
              <label htmlFor="nombreProyecto">Nombre Proyecto</label>
            </div>

            <div className="col-md-4 form-floating">
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={filters.fechaInicio}
                onChange={handleChange}
                className="form-control"
                placeholder="Fecha Inicio"
              />
              <label htmlFor="fechaInicio">Fecha Inicio</label>
            </div>

            <div className="col-md-4 form-floating">
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={filters.fechaFin}
                onChange={handleChange}
                className="form-control"
                placeholder="Fecha Final"
              />
              <label htmlFor="fechaFin">Fecha Final</label>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-warning me-2" onClick={handleReset}>
              Limpiar filtros
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAdvanced(false)}
            >
              Ocultar filtros
            </button>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nombre Proyecto</th>
              <th>Estatus</th>
              <th>Inicio</th>
              <th>Final</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((p) => (
              <tr key={p.idProyecto}>
                <td>{p.NombreProyecto}</td>
                <td>{p.Estatus ? "Activo" : "Inactivo"}</td>
                <td>{formatDate(p.DuracionFechaInicio)}</td>
                <td>{formatDate(p.DuracionFechaFin)}</td>
                
                <td>
                  <Link
                    to={`/proyectos/edit/${p.idProyecto}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.idProyecto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProyectoList;