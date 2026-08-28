// =======================================================
// CAPA DE ACCESO A DATOS (API REST - Refactorizada v7)
// =======================================================
// Importamos la URL base centralizada desde config.js
import { API_BASE_URL } from "./config";

/**
 * 1. OBTENER CONTACTOS (GET)
 * Consulta la lista completa de contactos desde el backend.
 */
export async function listarContactos() {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) {
    throw new Error("No se pudo obtener la lista de contactos del servidor.");
  }
  return await res.json();
}

/**
 * 2. CREAR CONTACTO (POST)
 * Envía un nuevo contacto en formato JSON al servidor.
 * @param {Object} nuevoContacto - Objeto con datos del formulario
 */
export async function crearContacto(nuevoContacto) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoContacto),
  });

  if (!res.ok) {
    throw new Error("Error en el servidor al intentar guardar el contacto.");
  }
  return await res.json();
}

/**
 * 3. ELIMINAR CONTACTO (DELETE)
 * Remueve un contacto por su identificador único (id).
 * @param {string|number} id - Identificador del contacto
 */
export async function eliminarContactoPorId(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error en el servidor al intentar eliminar el contacto.");
  }
  return true;
}
