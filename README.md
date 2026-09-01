# 📱 Agenda ADSO v9 — Sistema Completo de Gestión de Contactos (CRUD)

> **Proyecto ABP (Aprendizaje Basado en Proyectos)**  
> **Programa:** Análisis y Desarrollo de Software (ADSO) • **Ficha:** 3412785  
> **Centro:** Centro de la Tecnología de la Manufactura Avanzada (CTMA) — SENA  
> **Instructor:** Gustavo Bolaños  
> **Versión Final:** v9 (Clase 11 - Cierre de Calidad y CRUD Completo)

---

## 🌟 Descripción General

**Agenda ADSO v9** es una aplicación web moderna, reactiva y modular desarrollada en **React 19**, empaquetada con **Vite** y estilizada mediante **Tailwind CSS**. Implementa el ciclo **CRUD completo** (Crear, Leer, Actualizar y Eliminar) consumiendo una API REST simulada con **JSON Server**, incorporando validaciones reactivas en tiempo real, búsqueda predictiva multicampo, ordenamiento inmutable bidireccional y una arquitectura de componentes escalable.

---

## 🚀 Funcionalidades Principales

1. **Ciclo CRUD Completo:**
   - **CREATE (`POST`):** Formulario controlado con validación de campos obligatorios, longitud mínima de teléfono y formato de correo electrónico.
   - **READ (`GET`):** Carga asíncrona mediante `useEffect` al iniciar la app con estados de carga (`loading`) y manejo de errores de conexión.
   - **UPDATE (`PUT` - Clase 11):** Edición completa de contactos existentes mediante la reutilización inteligente del formulario, carga dinámica de datos, scroll interactivo y botón para cancelar la edición.
   - **DELETE (`DELETE`):** Eliminación controlada con confirmación previa y feedback visual al usuario.

2. **Búsqueda Reactiva Multicampo:**
   - Filtrado en tiempo real sin recarga de página evaluando coincidencias en: **Nombre**, **Teléfono**, **Correo** y **Categoría/Etiqueta**.
   - Botón de limpieza rápida y estado vacío inteligente si ningún contacto coincide con la búsqueda.

3. **Ordenamiento Alfabético Inmutable:**
   - Alternancia entre orden ascendente (**A-Z**) y descendente (**Z-A**) usando el operador spread (`[...]`) para garantizar inmutabilidad en el estado de React.

4. **Experiencia de Usuario (UX) y Notificaciones:**
   - Badges temáticos por categoría: *Amigos*, *Trabajo*, *Familia*, *SENA*.
   - Mensajes temporizados de éxito (autodismiss en 4 segundos) y alertas claras en caso de fallos de red.
   - Contador dinámico con gramática adaptativa ("Mostrando 1 contacto" / "Mostrando N contactos").

5. **Calidad de Código y Buenas Prácticas:**
   - Análisis estático de código limpio con **Oxlint** (0 advertencias, 0 errores).
   - Variables de configuración centralizadas en `src/config.js`.
   - Capa de acceso a datos desacoplada en `src/api.js`.

---

## 🛠️ Tecnologías y Herramientas

- **Frontend:** React 19, JavaScript (ES6+), JSX
- **Build Tool:** Vite 8.2
- **Estilos:** Tailwind CSS v4
- **Servidor Mock:** JSON Server (REST API en puerto 3000)
- **Linter:** Oxlint
- **Control de Versiones:** Git & GitHub

---

## 📁 Estructura del Proyecto

```text
AgendaAdsoV4/
├── db.json                     # Base de datos simulada para JSON Server
├── index.html                  # Punto de entrada HTML5
├── package.json                # Dependencias y scripts del proyecto
├── README.md                   # Documentación técnica del portafolio
├── vite.config.js              # Configuración de Vite
└── src/
    ├── main.jsx                # Renderizado raíz de React
    ├── App.jsx                 # Componente contenedor principal y lógica de estado
    ├── api.js                  # Capa de servicios REST (GET, POST, PUT, DELETE)
    ├── config.js               # Constantes y configuración global
    ├── index.css               # Directivas de Tailwind CSS
    └── components/
        ├── FormularioContacto.jsx   # Formulario dual (Crear / Editar)
        └── ContactoCard.jsx         # Tarjeta individual con botones de acción
```

---

## 💻 Instrucciones de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** (gestor de paquetes de Node)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/AgendaAdsoV4.git
cd AgendaAdsoV4
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Iniciar el servidor de API (JSON Server)
En una terminal independiente:
```bash
npx json-server db.json --port 3000
```

### Paso 4: Iniciar la aplicación React (Vite)
En otra terminal:
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

---

## 🧪 Comandos de Calidad y Compilación

- **Ejecutar Linter:**
  ```bash
  npm run lint
  ```
- **Compilar para Producción:**
  ```bash
  npm run build
  ```
- **Previsualizar Build:**
  ```bash
  npm run preview
  ```

---

## 👨‍💻 Autor y Créditos

- **Desarrollador / Aprendiz:** Bryan Quintero
- **Programa:** Análisis y Desarrollo de Software (ADSO) — SENA CTMA
- **Instructor Guía:** Gustavo Bolaños
- **Commit Oficial de Entrega:** `Clase_11_Agenda_ADSO_v9_Editar_Contactos_Cierre_ABP`
