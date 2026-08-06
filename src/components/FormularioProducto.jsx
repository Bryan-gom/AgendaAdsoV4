import React, { useState } from "react";

export default function FormularioProducto({ onAgregar }) {
  // 7.1 Formulario controlado con useState
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    cantidad: "",
    precio: "",
    responsable: "",
    estado: "Disponible",
  });

  // Mensajes de validación visible (7.2)
  const [error, setError] = useState("");

  // Función general recomendada que extrae name y value con spread operator
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al interactuar
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 7.2 Validaciones visibles obligatorias:
    // - nombre vacío
    // - categoría sin seleccionar
    // - cantidad menor que uno
    // - precio igual o menor que cero
    // - responsable vacío

    if (!formData.nombre.trim()) {
      setError("El nombre del producto no puede estar vacío.");
      return;
    }

    if (!formData.categoria) {
      setError("Debes seleccionar una categoría para el producto.");
      return;
    }

    const cantidadNum = Number(formData.cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      setError("La cantidad debe ser un número entero mayor o igual a 1.");
      return;
    }

    const precioNum = Number(formData.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError("El precio unitario debe ser mayor a 0.");
      return;
    }

    if (!formData.responsable.trim()) {
      setError("El nombre del responsable no puede estar vacío.");
      return;
    }

    if (!formData.estado) {
      setError("Debes seleccionar un estado para el producto.");
      return;
    }

    // 7.3 Crear el objeto producto
    const nuevoProducto = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now() + Math.random().toString(36).substring(2, 9),
      nombre: formData.nombre.trim(),
      categoria: formData.categoria,
      cantidad: cantidadNum,
      precio: precioNum,
      responsable: formData.responsable.trim(),
      estado: formData.estado,
    };

    // Enviar al componente padre
    onAgregar(nuevoProducto);

    // Limpiar todos los campos y resetear errores
    setFormData({
      nombre: "",
      categoria: "",
      cantidad: "",
      precio: "",
      responsable: "",
      estado: "Disponible",
    });
    setError("");
  };

  return (
    <form className="form-producto" onSubmit={handleSubmit} noValidate>
      <h2 className="form-titulo">Registrar Nuevo Producto</h2>

      {/* 7.2 Mensaje de error visible */}
      {error && (
        <div className="alerta-error" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="nombre">Nombre del producto *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ej. Computador Portátil Lenovo"
          value={formData.nombre}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="categoria">Categoría *</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Herramientas">Herramientas</option>
            <option value="Papelería">Papelería</option>
            <option value="Mobiliario">Mobiliario</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado *</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Disponible">Disponible</option>
            <option value="Prestado">Prestado</option>
            <option value="En mantenimiento">En mantenimiento</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cantidad">Cantidad *</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            min="1"
            placeholder="Ej. 5"
            value={formData.cantidad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio Unitario ($) *</label>
          <input
            type="number"
            id="precio"
            name="precio"
            min="1"
            step="any"
            placeholder="Ej. 1200000"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="responsable">Responsable *</label>
        <input
          type="text"
          id="responsable"
          name="responsable"
          placeholder="Ej. Juan Pérez"
          value={formData.responsable}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn-primario">
        ➕ Agregar Producto
      </button>
    </form>
  );
}
