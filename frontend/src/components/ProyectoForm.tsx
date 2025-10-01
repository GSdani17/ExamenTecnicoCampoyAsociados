import React, { useState, useEffect } from "react";
import { Proyecto } from "../models/Proyecto";

interface ProyectoFormProps {
  initialData?: Omit<Proyecto, "idProyecto">;
  onSubmit: (data: Omit<Proyecto, "idProyecto">) => void;
  mode: "add" | "edit"; 
}

const ProyectoForm: React.FC<ProyectoFormProps> = ({ initialData, onSubmit, mode }) => {
  const [form, setForm] = useState<Omit<Proyecto, "idProyecto">>({
    NombreProyecto: "",
    Estatus: true,
    DuracionFechaInicio: "",
    DuracionFechaFin: "",
    ...initialData
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setForm({ ...form, [name]: e.target.checked });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (name === "NombreProyecto") {
      const nombreValido = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/;
      if (!nombreValido.test(value)) {
        setErrors({ ...errors, NombreProyecto: "Solo se permiten letras, números y espacios" });
      } else {
        setErrors({ ...errors, NombreProyecto: "" });
      }
    }
  };

  const handleReset = () => {
    setForm({
      NombreProyecto: "",
      Estatus: true,
      DuracionFechaInicio: "",
      DuracionFechaFin: ""
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hayErrores = Object.values(errors).some(err => err !== "");
    if (hayErrores) {
      alert("Corrige los errores antes de enviar el formulario");
      return;
    }

    if (form.DuracionFechaInicio && form.DuracionFechaFin) {
      const inicio = new Date(form.DuracionFechaInicio);
      const fin = new Date(form.DuracionFechaFin);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (inicio < hoy) {
        alert("La fecha de inicio no puede ser anterior a hoy");
        return;
      }

      if (fin < hoy) {
        alert("La fecha final no puede ser anterior a hoy");
        return;
      }

      if (fin <= inicio) {
        alert("La fecha final debe ser mayor a la fecha de inicio");
        return;
      }
    }

    try {
      await onSubmit(form);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message);
      } else {
        alert("Error inesperado al guardar el proyecto");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Nombre Proyecto:</label>
          <input
            name="NombreProyecto"
            value={form.NombreProyecto}
            onChange={handleChange}
            className={`form-control ${errors.NombreProyecto ? "is-invalid" : ""}`}
            required
          />
          {errors.NombreProyecto && (
            <div className="invalid-feedback">{errors.NombreProyecto}</div>
          )}
        </div>

        {mode === "edit" && (
          <div className="col-md-4">
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
        )}
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Fecha Inicio:</label>
          <input
            type="date"
            name="DuracionFechaInicio"
            value={form.DuracionFechaInicio}
            onChange={handleChange}
            className="form-control"
            required
            min={today}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha Final:</label>
          <input
            type="date"
            name="DuracionFechaFin"
            value={form.DuracionFechaFin}
            onChange={handleChange}
            className="form-control"
            required
            min={today}
          />
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>

        {mode === "add" && (
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Limpiar Formulario
          </button>
        )}
      </div>
    </form>
  );
};

export default ProyectoForm;