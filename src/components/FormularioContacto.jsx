import { useState } from "react";

// =======================================================
// COMPONENTE: FormularioContacto (Clase 8 - Validaciones y UX)
// =======================================================
// Permite al usuario crear nuevos contactos validando que los datos
// sean correctos antes de enviarlos al servidor (JSON Server).

function FormularioContacto({ onAgregar }) {
  // 1. Estado para almacenar los valores que el usuario escribe
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "Amigos",
  });

  // 2. Estado para almacenar los mensajes de error por cada campo
  const [errores, setErrores] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });

  // 3. Estado para saber si el formulario está en proceso de envío
  // Sirve para deshabilitar el botón y evitar que el usuario haga doble clic
  const [enviando, setEnviando] = useState(false);

  // Manejador que se ejecuta al escribir en cualquier input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Función encargada de validar los campos del formulario
  // Retorna true si todos los datos son válidos, o false si hay algún error
  const validarFormulario = () => {
    const nuevosErrores = { nombre: "", telefono: "", correo: "" };

    // Validación del campo Nombre (.trim() elimina espacios en blanco vacíos)
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    // Validación del campo Teléfono
    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (form.telefono.trim().length < 7) {
      nuevosErrores.telefono = "El teléfono debe tener al menos 7 dígitos.";
    }

    // Validación del campo Correo Electrónico
    if (!form.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!form.correo.includes("@") || !form.correo.includes(".")) {
      nuevosErrores.correo = "El correo debe tener un formato válido (ej. usuario@dominio.com).";
    }

    // Guardamos los errores en el estado para que React los pinte en pantalla
    setErrores(nuevosErrores);

    // Si ningún campo tiene error, el formulario es válido
    return !nuevosErrores.nombre && !nuevosErrores.telefono && !nuevosErrores.correo;
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página

    // Si la validación falla, nos detenemos y NO enviamos los datos
    if (!validarFormulario()) return;

    try {
      setEnviando(true); // Bloqueamos el botón y cambiamos el texto a "Guardando..."
      
      // Llamamos a la función de guardado que viene de App.jsx
      await onAgregar(form);

      // Si se guardó correctamente, limpiamos los campos y los errores
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
    } finally {
      // Siempre apagamos el estado enviando, haya salido bien o mal
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4"
    >
      <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
        ➕ Agregar Nuevo Contacto
      </h2>

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
          {/* Mensaje de error visual debajo del input */}
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
          {/* Mensaje de error visual */}
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
          {/* Mensaje de error visual */}
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

      {/* Botón de Enviar controlado por el estado 'enviando' */}
      <button
        type="submit"
        disabled={enviando}
        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition duration-200 shadow hover:shadow-md cursor-pointer"
      >
        {enviando ? "⏳ Guardando..." : "Agregar contacto"}
      </button>
    </form>
  );
}

export default FormularioContacto;
