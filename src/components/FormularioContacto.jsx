/* eslint-disable react/set-state-in-effect */
import { useState, useEffect } from "react";

// =======================================================
// COMPONENTE: FormularioContacto (Agenda ADSO v9 - Clase 11)
// =======================================================
// Reutilizable tanto para Crear (POST) como para Editar (PUT).
// Recibe 'contactoEnEdicion', 'onGuardar' y 'onCancelarEdicion'.

function FormularioContacto({ onGuardar, contactoEnEdicion, onCancelarEdicion }) {
  // Estado local para los campos del formulario
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "Amigos",
  });

  // Estado local para mensajes de error de validación
  const [errores, setErrores] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });

  // Estado local para indicar proceso de guardado asíncrono
  const [enviando, setEnviando] = useState(false);

  // Sincronizar el formulario cuando cambie contactoEnEdicion
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    if (contactoEnEdicion) {
      setForm({
        nombre: contactoEnEdicion.nombre || "",
        telefono: contactoEnEdicion.telefono || "",
        correo: contactoEnEdicion.correo || "",
        etiqueta: contactoEnEdicion.etiqueta || "Amigos",
      });
      setErrores({ nombre: "", telefono: "", correo: "" });
    } else {
      setForm({
        nombre: "",
        telefono: "",
        correo: "",
        etiqueta: "Amigos",
      });
      setErrores({ nombre: "", telefono: "", correo: "" });
    }
  }, [contactoEnEdicion]);

  // Manejador que se ejecuta al escribir en cualquier input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Función de validación de campos
  const validarFormulario = () => {
    const nuevosErrores = { nombre: "", telefono: "", correo: "" };

    // Validación de Nombre
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    // Validación de Teléfono
    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (form.telefono.trim().length < 7) {
      nuevosErrores.telefono = "El teléfono debe tener al menos 7 dígitos.";
    }

    // Validación de Correo
    if (!form.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      nuevosErrores.correo = "El correo debe tener un formato válido (ej. usuario@dominio.com).";
    }

    setErrores(nuevosErrores);
    return !nuevosErrores.nombre && !nuevosErrores.telefono && !nuevosErrores.correo;
  };

  // Manejador del envío
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setEnviando(true);
      const datosLimpios = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        correo: form.correo.trim(),
        etiqueta: form.etiqueta,
      };
      await onGuardar(datosLimpios);

      // Si es exitoso y no estamos en edición, limpiar
      if (!contactoEnEdicion) {
        setForm({
          nombre: "",
          telefono: "",
          correo: "",
          etiqueta: "Amigos",
        });
      }
      setErrores({
        nombre: "",
        telefono: "",
        correo: "",
      });
    } finally {
      setEnviando(false);
    }
  };

  // Manejador del botón cancelar
  const handleCancelar = () => {
    setForm({
      nombre: "",
      telefono: "",
      correo: "",
      etiqueta: "Amigos",
    });
    setErrores({
      nombre: "",
      telefono: "",
      correo: "",
    });
    if (onCancelarEdicion) {
      onCancelarEdicion();
    }
  };

  const estaEnModoEdicion = Boolean(contactoEnEdicion);

  return (
    <form
      id="formulario-contacto"
      onSubmit={handleSubmit}
      className={`bg-white p-6 rounded-2xl shadow-sm border mb-8 space-y-4 transition-colors ${
        estaEnModoEdicion ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>{estaEnModoEdicion ? "✏️ Editar Contacto" : "➕ Agregar Nuevo Contacto"}</span>
          {estaEnModoEdicion && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
              Modo Edición
            </span>
          )}
        </h2>
      </div>

      {/* Cuadrícula de inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo: Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Camila Pérez"
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
              errores.nombre
                ? "border-red-400 focus:ring-red-300 bg-red-50/30"
                : "border-slate-300 focus:ring-blue-500"
            }`}
          />
          {errores.nombre && (
            <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {errores.nombre}</p>
          )}
        </div>

        {/* Campo: Teléfono */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Teléfono Móvil <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Ej. 3001234567"
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
              errores.telefono
                ? "border-red-400 focus:ring-red-300 bg-red-50/30"
                : "border-slate-300 focus:ring-blue-500"
            }`}
          />
          {errores.telefono && (
            <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {errores.telefono}</p>
          )}
        </div>

        {/* Campo: Correo Electrónico */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Ej. camila@sena.edu.co"
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
              errores.correo
                ? "border-red-400 focus:ring-red-300 bg-red-50/30"
                : "border-slate-300 focus:ring-blue-500"
            }`}
          />
          {errores.correo && (
            <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {errores.correo}</p>
          )}
        </div>

        {/* Campo: Categoría / Etiqueta */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Categoría / Etiqueta
          </label>
          <select
            name="etiqueta"
            value={form.etiqueta}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="Amigos">Amigos</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Familia">Familia</option>
            <option value="SENA">SENA</option>
          </select>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className={`w-full md:w-auto px-6 py-2.5 text-white font-semibold rounded-xl transition duration-200 shadow hover:shadow-md cursor-pointer disabled:cursor-not-allowed ${
            estaEnModoEdicion
              ? "bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300"
              : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          }`}
        >
          {enviando
            ? estaEnModoEdicion
              ? "⏳ Guardando cambios..."
              : "⏳ Agregando..."
            : estaEnModoEdicion
            ? "Guardar cambios"
            : "Agregar contacto"}
        </button>

        {estaEnModoEdicion && (
          <button
            type="button"
            onClick={handleCancelar}
            disabled={enviando}
            className="w-full md:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioContacto;
