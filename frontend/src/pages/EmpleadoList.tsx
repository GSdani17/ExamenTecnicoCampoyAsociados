import React, { useEffect, useState } from "react";
import { Empleado } from "../models/Empleado";
import { Proyecto } from "../models/Proyecto";
import { useNavigate } from "react-router-dom";
import { deleteEmpleado, getEmpleados } from "../services/EmpleadosService";
import { getProyectos } from "../services/ProyectoService";

const EmpleadoList: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [filters, setFilters] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    edadMin: "",
    edadMax: "",
    idProyecto: 0, 
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
    fetchProyectos();
  }, []);

  const fetchEmpleados = async (params?: any) => {
    const data = await getEmpleados(params);
    setEmpleados(data);
  };

  const fetchProyectos = async () => {
    const data = await getProyectos();
    setProyectos(data.filter((p) => p.Estatus));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: name === "idProyecto" ? Number(value) : value });
  };

  const handleSearch = () => {
    if (filters.edadMin && filters.edadMax && Number(filters.edadMin) > Number(filters.edadMax)) {
      alert("La edad mínima no puede ser mayor que la edad máxima.");
      return;
    }
    fetchEmpleados(filters);
  };

  const handleReset = () => {
    setFilters({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      edadMin: "",
      edadMax: "",
      idProyecto: 0,
    });
    fetchEmpleados();
  };

  const handleDelete = async (id: number) => {
    await deleteEmpleado(id);
    setEmpleados(empleados.filter(emp => emp.idEmpleado !== id));
  };

  const formatDate = (isoDate: string | undefined, withTime: boolean = false) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate() + 1).padStart(2, "0"); 
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    if (withTime) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Empleados</h2>
        <button className="btn btn-primary" onClick={() => navigate("/add")}>
          Agregar Empleado
        </button>
      </div>

      {!showAdvanced && (
        <div className="mb-3">
          <button className="btn btn-secondary" onClick={() => setShowAdvanced(true)}>
            Búsqueda Avanzada
          </button>
        </div>
      )}

      {showAdvanced && (
        <div className="card card-body mb-3">
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="nombre"
                placeholder="Nombre"
                value={filters.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={filters.apellidoPaterno}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={filters.apellidoMaterno}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2"> <input type="number" className="form-control" name="edadMin" placeholder="Edad Mínima" value={filters.edadMin} onChange={handleChange} /> </div>
            <div className="col-md-2"> <input type="number" className="form-control" name="edadMax" placeholder="Edad Máxima" value={filters.edadMax} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="idProyecto"
                value={filters.idProyecto}
                onChange={handleChange}
              >
                <option value={0}>Todos los Proyectos</option>
                {proyectos.map((p) => (
                  <option key={p.idProyecto} value={p.idProyecto}>
                    {p.NombreProyecto}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-success me-2" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-warning me-2" onClick={handleReset}>
              Limpiar filtros
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAdvanced(false)}>
              Ocultar filtros
            </button>
          </div>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre Completo</th>
            <th>Fecha Nacimiento</th>
            <th>Fecha Alta</th>
            <th>Sueldo</th>
            <th>Correo</th>
            <th>Estatus</th>
            <th>Proyecto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.idEmpleado}>
              <td>{`${emp.Nombre} ${emp.ApellidoPaterno} ${emp.ApellidoMaterno}`}</td>
              <td>{formatDate(emp.FechaNacimiento)}</td>
              {/* <td>{formatDate(emp.FechaAlta, true)}</td> */}
              <td>{new Date(new Date(emp.FechaAlta).getTime()).toLocaleDateString()}</td>
              <td>{emp.Sueldo.toFixed(2)}</td>
              <td>{emp.Correo}</td>
              <td>{emp.Estatus ? "Activo" : "Inactivo"}</td>
              <td>{emp.NombreProyecto}</td>
              <td>
                <button className="btn btn-sm btn-info me-1" onClick={() => navigate(`/edit/${emp.idEmpleado}`)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.idEmpleado)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadoList;