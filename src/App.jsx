// =======================================================
// COMPONENTE PRINCIPAL: App (Agenda ADSO v8 - Búsqueda y Orden)
// =======================================================
// Orquesta el estado global de la agenda, la comunicación con la API REST,
// el filtrado reactivo multircampo, el ordenamiento inmutable y el renderizado.

import { useState, useEffect } from "react";
// Importamos la configuración global y metadatos de la aplicación
import { APP_INFO } from "./config";
// Importamos la capa de servicios desacoplada
import { listarContactos, crearContacto, eliminarContactoPorId } from "./api";
// Importamos componentes de interfaz modulares
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  // Estado base: lista de contactos obtenida de la API
  const [contactos, setContactos] = useState([]);
  // Estados para control de carga asíncrona y errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // NUEVOS ESTADOS PARA BÚSQUEDA Y ORDENAMIENTO (CLASE 10)
  // =======================================================
  // Estado para el término de búsqueda ingresado en el input controlado
  const [busqueda, setBusqueda] = useState(
    () => new URLSearchParams(window.location.search).get("q") || ""
  );
  // Estado booleano para alternar orden: true = A-Z (Ascendente), false = Z-A (Descendente)
  const [ordenAsc, setOrdenAsc] = useState(
    () => new URLSearchParams(window.location.search).get("ord") !== "desc"
  );

  // Carga inicial asíncrona de contactos al montar el componente (GET)
  useEffect(() => {
    const cargarContactosIniciales = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await listarContactos();
        setContactos(data);
      } catch (err) {
        console.error("Error al cargar contactos:", err);
        setError(
          "No se pudieron cargar los contactos. Verifica que JSON Server esté activo en el puerto configurado."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarContactosIniciales();
  }, []);

  // Manejador para agregar un nuevo contacto mediante la API (POST)
  const handleAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");
      const creado = await crearContacto(nuevoContacto);
      // Inserción inmutable en el estado local base
      setContactos((prev) => [...prev, creado]);
    } catch (err) {
      console.error("Error al guardar contacto:", err);
      setError(
        "No se pudo guardar el contacto. Verifica la conexión con el servidor e intenta nuevamente."
      );
      throw err; // Permite al formulario controlar su estado local (enviando)
    }
  };

  // Manejador para eliminar un contacto por su ID mediante la API (DELETE)
  const handleEliminarContacto = async (id) => {
    try {
      setError("");
      await eliminarContactoPorId(id);
      // Filtrado inmutable para actualizar el estado base
      setContactos((prev) => prev.filter((contacto) => contacto.id !== id));
    } catch (err) {
      console.error("Error al eliminar contacto:", err);
      setError("No se pudo eliminar el contacto del servidor.");
    }
  };

  // =======================================================
  // 1. TRANSFORMACIÓN: FILTRADO REACTIVO MULTIRCAMPO
  // =======================================================
  // Incluye búsqueda en: nombre, correo, etiqueta y teléfono (Mini Reto 1)
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return true;

    const nombre = (c.nombre || "").toLowerCase();
    const correo = (c.correo || "").toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();
    const telefono = (c.telefono || "").toString().toLowerCase(); // Mini Reto 1

    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino) ||
      telefono.includes(termino)
    );
  });

  // =======================================================
  // 2. TRANSFORMACIÓN: ORDENAMIENTO INMUTABLE (A-Z / Z-A)
  // =======================================================
  // Creamos una copia con spread [...] para NO mutar el array original
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = (a.nombre || "").toLowerCase();
    const nombreB = (b.nombre || "").toLowerCase();

    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  // Mensaje formateado para el contador de resultados (Mini Reto 2)
  const totalVisibles = contactosOrdenados.length;
  const textoContador =
    totalVisibles === 1 ? "Mostrando 1 contacto" : `Mostrando ${totalVisibles} contactos`;

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

        {/* Banner de error amigable */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Componente del Formulario de Contactos */}
        <FormularioContacto onAgregar={handleAgregarContacto} />

        {/* Sección del Listado de Contactos con Búsqueda y Ordenamiento */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              📋 Lista de Contactos ({contactos.length})
            </h2>
            {/* Mini Reto 2: Contador dinámico con gramática adaptativa */}
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
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition"
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
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-2xs whitespace-nowrap"
              >
                <span>{ordenAsc ? "🔤 Orden: A-Z" : "🔤 Orden: Z-A"}</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                  {ordenAsc ? "Ascendente" : "Descendente"}
                </span>
              </button>
            </div>
          )}

          {/* Renderizado condicional según estado de carga, lista vacía o filtro sin coincidencias */}
          {cargando ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              ⏳ Cargando contactos desde la API...
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
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
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
