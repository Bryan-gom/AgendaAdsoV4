// =======================================================
// CONFIGURACIÓN GLOBAL DE LA APLICACIÓN (Agenda ADSO v10)
// =======================================================
// Centraliza variables y constantes reutilizables para facilitar el
// mantenimiento y evitar valores quemados (hardcodeados) en el código.

// URL base de la API REST desplegada en Render.
// IMPORTANTE: aquí ya no usamos "http://localhost:3000",
// sino la URL pública que nos da Render.
export const API_BASE_URL = "https://agenda-adso-api-fufr.onrender.com/contactos";

// Metadatos e información general para el encabezado y vistas
export const APP_INFO = {
  ficha: "3412785",
  titulo: "Agenda ADSO v10",
  subtitulo:
    "Gestión de contactos conectada a una API remota en Render, con validaciones y mejor experiencia de usuario.",
  instructor: "Gustavo Bolaños",
  programa: "Análisis y Desarrollo de Software (ADSO)",
  centro: "Centro de la Tecnología de la Manufactura Avanzada (CTMA)",
};
