// =======================================================
// CONFIGURACIÓN GLOBAL DE LA APLICACIÓN (Agenda ADSO v8)
// =======================================================
// Centraliza variables y constantes reutilizables para facilitar el
// mantenimiento y evitar valores quemados (hardcodeados) en el código.

// URL base de la API REST local (JSON Server)
export const API_BASE_URL = "http://localhost:3000/contactos";

// Metadatos e información general para el encabezado y vistas
export const APP_INFO = {
  ficha: "3412785",
  titulo: "Agenda ADSO v8",
  subtitulo:
    "Gestión de contactos con API local (JSON Server), validaciones, búsqueda predictiva multircampo y ordenamiento alfabético.",
  instructor: "Gustavo Bolaños",
  programa: "Análisis y Desarrollo de Software (ADSO)",
  centro: "Centro de la Tecnología de la Manufactura Avanzada (CTMA)",
};
