import React, { useState, useEffect } from "react";
import { Empleado } from "../models/Empleado";
import { Proyecto } from "../models/Proyecto";
import { getProyectos } from "../services/ProyectoService";

interface EmpleadoFormProps {
  initialData?: Omit<Empleado, "idEmpleado">;
  onSubmit: (data: Omit<Empleado, "idEmpleado">) => void;
}

const EmpleadoForm: React.FC<EmpleadoFormProps> = ({ initialData, onSubmit }) => {
  const initialFormState: Omit<Empleado, "idEmpleado"> = {
    Nombre: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    FechaNacimiento: "",
    FechaAlta: "",
    Sueldo: 0,
    Estatus: true,
    Correo: "",
    Telefono: "", 
    idProyecto: 0,
    NombreProyecto: "",
    ...initialData,
  };

  const [form, setForm] = useState<Omit<Empleado, "idEmpleado">>(initialFormState);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getProyectos().then(setProyectos);
  }, []);

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
    const telefonoRegex = /^[0-9]{0,10}$/; // permite hasta 10 mientras escribe

    if (name === "Nombre" || name === "ApellidoPaterno" || name === "ApellidoMaterno") {
      if (!soloLetras.test(value)) {
        setErrors({ ...errors, [name]: "Solo se permiten letras y espacios" });
        return;
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }

    if (name === "Telefono") {
      if (!telefonoRegex.test(value)) {
        return; 
      }

      if (value.length !== 10 && value.length > 0) {
        setErrors({
          ...errors,
          Telefono: "El teléfono debe tener exactamente 10 dígitos",
        });
      } else {
        setErrors({ ...errors, Telefono: "" });
      }
    }

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setForm({ ...form, [name]: e.target.checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hayErrores = Object.values(errors).some((err) => err !== "");
    if (hayErrores) {
      alert("Corrige los errores antes de enviar el formulario");
      return;
    }

    if (!form.FechaNacimiento || calcularEdad(form.FechaNacimiento) < 18) {
      alert("El empleado debe tener al menos 18 años");
      return;
    }

    if (Number(form.Sueldo) <= 0) {
      alert("El sueldo debe ser mayor a 0");
      return;
    }

    if (Number(form.idProyecto) === 0) {
      alert("Debe seleccionar un proyecto válido");
      return;
    }

    if (!form.Telefono || form.Telefono.length !== 10) {
      alert("Debe ingresar un teléfono válido de 10 dígitos");
      return;
    }

    try {
      await onSubmit({
        ...form,
        Sueldo: Number(form.Sueldo),
        idProyecto: Number(form.idProyecto),
      });
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message);
      } else {
        alert("Error inesperado al guardar el proyecto");
      }
    }
  };

  const handleReset = () => {
    setForm(initialFormState); 
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Nombre:</label>
          <input
            name="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            className={`form-control ${errors.Nombre ? "is-invalid" : ""}`}
            required
          />
          {errors.Nombre && <div className="invalid-feedback">{errors.Nombre}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Apellido Paterno:</label>
          <input
            name="ApellidoPaterno"
            value={form.ApellidoPaterno}
            onChange={handleChange}
            className={`form-control ${errors.ApellidoPaterno ? "is-invalid" : ""}`}
            required
          />
          {errors.ApellidoPaterno && (
            <div className="invalid-feedback">{errors.ApellidoPaterno}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">Apellido Materno:</label>
          <input
            name="ApellidoMaterno"
            value={form.ApellidoMaterno}
            onChange={handleChange}
            className={`form-control ${errors.ApellidoMaterno ? "is-invalid" : ""}`}
            required
          />
          {errors.ApellidoMaterno && (
            <div className="invalid-feedback">{errors.ApellidoMaterno}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Fecha Nacimiento:</label>
          <input
            type="date"
            name="FechaNacimiento"
            value={form.FechaNacimiento}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4" hidden={form.FechaAlta === ""}>
          <label className="form-label">Fecha Alta:</label>
          <input
            type="datetime-local"
            name="FechaAlta"
            value={form.FechaAlta}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Sueldo:</label>
          <input
            type="number"
            name="Sueldo"
            value={form.Sueldo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Correo:</label>
          <input
            type="email"
            name="Correo"
            value={form.Correo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Teléfono:</label>
          <input
            type="text"
            name="Telefono"
            value={form.Telefono}
            onChange={handleChange}
            className={`form-control ${errors.Telefono ? "is-invalid" : ""}`}
            required
            maxLength={10}
          />
          {errors.Telefono && <div className="invalid-feedback">{errors.Telefono}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Proyecto:</label>
          <select
            name="idProyecto"
            value={form.idProyecto}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value={0} disabled>
              Seleccione un Proyecto Activo
            </option>
            {proyectos
              .filter((p) => p.Estatus)
              .map((p) => (
                <option key={p.idProyecto} value={p.idProyecto}>
                  {p.NombreProyecto}
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-4" hidden={form.FechaAlta === ""}>
          <label className="form-label">Estatus:</label>
          <div className="form-check">
            <input
              type="checkbox"
              name="Estatus"
              checked={form.Estatus}
              onChange={handleChange}
              className="form-check-input"
              id="estatusCheck"
            />
            <label htmlFor="estatusCheck" className="form-check-label">
              {form.Estatus ? "Activo" : "Inactivo"}
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <button
          type="button"
          hidden={form.FechaAlta !== ""}
          className="btn btn-secondary"
          onClick={handleReset}
        >
          Limpiar Formulario
        </button>
      </div>
    </form>
  );
};

export default EmpleadoForm;