import { useState, useEffect } from "react";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";
import { APP_INFO } from "./config";
import {
  listarContactos,
  crearContacto,
  actualizarContacto,
  eliminarContactoPorId,
} from "./api";

function App() {
  // =======================================================
  // ESTADOS PRINCIPALES DE LA APLICACIÓN
  // =======================================================
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Inicialización directa de estados (soporte para parámetros URL en pruebas y demo)
  const [mensajeExito, setMensajeExito] = useState(() => {
    const urlMsg = new URLSearchParams(window.location.search).get("success");
    return urlMsg ? decodeURIComponent(urlMsg) : "";
  });

  // Estado para la búsqueda y el ordenamiento (Clase 10)
  const [busqueda, setBusqueda] = useState(() => {
    return new URLSearchParams(window.location.search).get("q") || "";
  });

  const [ordenAsc, setOrdenAsc] = useState(() => {
    return new URLSearchParams(window.location.search).get("ord") !== "desc";
  });

  // Estado para el contacto en edición (Clase 11)
  // null = Modo creación, Objeto = Modo edición
  const [contactoEnEdicion, setContactoEnEdicion] = useState(null);

  // =======================================================
  // EFECTO: CARGA INICIAL DE DATOS DESDE LA API (GET)
  // =======================================================
  useEffect(() => {
    const editId = new URLSearchParams(window.location.search).get("edit");

    const obtenerContactos = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await listarContactos();
        setContactos(data);

        // Si se especificó un ID de edición en URL, cargarlo automáticamente
        if (editId) {
          const c = data.find((item) => String(item.id) === String(editId));
          if (c) setContactoEnEdicion(c);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Error al conectar con el servidor (JSON Server). Verifica que esté encendido en el puerto 3000."
        );
      } finally {
        setCargando(false);
      }
    };

    obtenerContactos();
  }, []);

  // Limpiar mensajes de éxito automáticamente tras 4 segundos
  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => setMensajeExito(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  // =======================================================
  // MANEJADORES DE EDICIÓN (Clase 11)
  // =======================================================
  const handleEditarClick = (contacto) => {
    setContactoEnEdicion(contacto);
    setError("");
    // Scroll suave hacia el formulario para mejorar la experiencia de usuario
    const formElement = document.getElementById("formulario-contacto");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCancelarEdicion = () => {
    setContactoEnEdicion(null);
  };

  // =======================================================
  // MANEJADOR UNIFICADO DE GUARDADO (POST / PUT)
  // =======================================================
  const handleGuardarContacto = async (datosForm) => {
    setError("");
    try {
      if (contactoEnEdicion) {
        // --- MODO EDICIÓN (PUT) ---
        const contactoActualizado = await actualizarContacto(
          contactoEnEdicion.id,
          datosForm
        );

        // Actualización inmutable del arreglo de contactos
        setContactos((prev) =>
          prev.map((c) =>
            c.id === contactoEnEdicion.id ? contactoActualizado : c
          )
        );

        setContactoEnEdicion(null);
        setMensajeExito(`¡Contacto "${contactoActualizado.nombre}" actualizado correctamente!`);
      } else {
        // --- MODO CREACIÓN (POST) ---
        const nuevoContacto = await crearContacto(datosForm);
        setContactos((prev) => [...prev, nuevoContacto]);
        setMensajeExito(`¡Contacto "${nuevoContacto.nombre}" guardado con éxito!`);
      }
    } catch (err) {
      console.error(err);
      setError(
        contactoEnEdicion
          ? "No se pudo actualizar el contacto en el servidor."
          : "No se pudo guardar el nuevo contacto en el servidor."
      );
      throw err; // Permite al formulario gestionar el estado de envío
    }
  };

  // =======================================================
  // MANEJADOR DE ELIMINACIÓN (DELETE)
  // =======================================================
  const handleEliminarContacto = async (id) => {
    const contactoAEliminar = contactos.find((c) => c.id === id);
    const nombre = contactoAEliminar ? contactoAEliminar.nombre : "el contacto";

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar a "${nombre}" de tu agenda?`
    );
    if (!confirmar) return;

    try {
      setError("");
      await eliminarContactoPorId(id);

      // Si el contacto que se está eliminando estaba en edición, cancelar la edición
      if (contactoEnEdicion && contactoEnEdicion.id === id) {
        setContactoEnEdicion(null);
      }

      setContactos((prev) => prev.filter((c) => c.id !== id));
      setMensajeExito(`Contacto "${nombre}" eliminado correctamente.`);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el contacto del servidor.");
    }
  };

  // =======================================================
  // TRANSFORMACIÓN REACTIVA 1: FILTRADO MULTICAMPO
  // =======================================================
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return true;

    const nombre = (c.nombre || "").toLowerCase();
    const correo = (c.correo || "").toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();
    const telefono = (c.telefono || "").toString().toLowerCase();

    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino) ||
      telefono.includes(termino)
    );
  });

  // =======================================================
  // TRANSFORMACIÓN REACTIVA 2: ORDENAMIENTO INMUTABLE
  // =======================================================
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre || "";
    const nombreB = b.nombre || "";
    const comparacion = nombreA.localeCompare(nombreB, "es", { sensitivity: "base" });
    return ordenAsc ? comparacion : -comparacion;
  });

  // Texto amigable para el contador de resultados
  const totalVisibles = contactosOrdenados.length;
  const textoContador =
    totalVisibles === 1
      ? "Mostrando 1 contacto"
      : `Mostrando ${totalVisibles} contactos`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado principal alimentado dinámicamente desde config.js */}
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-blue-600 uppercase">
            {APP_INFO.programa} • Ficha {APP_INFO.ficha}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
            {APP_INFO.titulo}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            {APP_INFO.subtitulo}
          </p>
        </header>

        {/* Notificación de éxito */}
        {mensajeExito && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs transition-all animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>{mensajeExito}</span>
            </div>
            <button
              type="button"
              onClick={() => setMensajeExito("")}
              className="text-emerald-600 hover:text-emerald-900 text-xs font-bold px-2 py-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Banner de error amigable */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start justify-between shadow-xs">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-900 text-xs font-bold px-2 py-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Componente del Formulario de Contactos (Creación / Edición) */}
        <FormularioContacto
          onGuardar={handleGuardarContacto}
          contactoEnEdicion={contactoEnEdicion}
          onCancelarEdicion={handleCancelarEdicion}
        />

        {/* Sección del Listado de Contactos con Búsqueda y Ordenamiento */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>📋 Lista de Contactos</span>
              <span className="text-sm font-normal text-slate-500">
                ({contactos.length} total)
              </span>
            </h2>

            {/* Contador dinámico con gramática adaptativa */}
            {contactos.length > 0 && (
              <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full w-fit">
                {textoContador}
              </span>
            )}
          </div>

          {/* Bloque interactivo de Búsqueda y Botón de Ordenamiento */}
          {contactos.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              {/* Input Controlado de Búsqueda */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="Buscar por nombre, teléfono, correo o etiqueta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm pointer-events-none">
                  🔍
                </span>
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Botón de alternancia de Ordenamiento (A-Z / Z-A) */}
              <button
                type="button"
                onClick={() => setOrdenAsc((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                <span>{ordenAsc ? "🔤 Orden: A-Z" : "🔤 Orden: Z-A"}</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {ordenAsc ? "Asc" : "Desc"}
                </span>
              </button>
            </div>
          )}

          {/* Renderizado condicional según estado de carga, lista vacía o filtro sin coincidencias */}
          {cargando ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              <span className="animate-spin inline-block mr-2">⏳</span> Cargando contactos desde la API...
            </div>
          ) : contactos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
              Aún no tienes contactos registrados. Agrega el primero usando el formulario superior.
            </div>
          ) : contactosOrdenados.length === 0 ? (
            // Mensaje amigable cuando la búsqueda no coincide
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-amber-300 p-6 text-slate-600 space-y-2">
              <div className="text-3xl">🔎</div>
              <p className="font-semibold text-slate-800">
                No se encontraron contactos que coincidan con la búsqueda
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hay resultados para "{busqueda}". Intenta con otro término o limpia el buscador.
              </p>
              <button
                type="button"
                onClick={() => setBusqueda("")}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Restablecer búsqueda
              </button>
            </div>
          ) : (
            // Renderizado de la lista filtrada y ordenada
            contactosOrdenados.map((contacto) => (
              <ContactoCard
                key={contacto.id}
                nombre={contacto.nombre}
                telefono={contacto.telefono}
                correo={contacto.correo}
                etiqueta={contacto.etiqueta}
                onEditar={() => handleEditarClick(contacto)}
                onEliminar={() => handleEliminarContacto(contacto.id)}
              />
            ))
          )}
        </section>

        {/* Pie de página con datos institucionales */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400 flex flex-col md:flex-row justify-between gap-2">
          <p>{APP_INFO.centro} • SENA</p>
          <p>Instructor: {APP_INFO.instructor}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
