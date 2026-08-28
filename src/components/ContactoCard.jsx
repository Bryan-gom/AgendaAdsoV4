// ==========================================
// COMPONENTE: ContactoCard
// ==========================================
// Renderiza la tarjeta individual para cada contacto de la agenda.
// Recibe los datos del contacto y la función 'onEliminar' por props.

function ContactoCard({ nombre, telefono, correo, etiqueta, onEliminar }) {
  // Función auxiliar para asignar un color agradable según la etiqueta
  const getBadgeColor = (tag) => {
    switch (tag) {
      case "Trabajo":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Familia":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "SENA":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Amigos":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Información del Contacto */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">{nombre}</h3>
          {/* Badge con la etiqueta */}
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getBadgeColor(
              etiqueta
            )}`}
          >
            {etiqueta}
          </span>
        </div>

        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span>📞 {telefono}</span>
          <span className="text-gray-300">•</span>
          <span>✉️ {correo}</span>
        </p>
      </div>

      {/* Botón para Eliminar */}
      <div>
        <button
          onClick={onEliminar}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors cursor-pointer"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}

export default ContactoCard;
