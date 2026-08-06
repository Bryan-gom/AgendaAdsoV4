import { useState, useEffect } from "react";
import "./App.css";
import FormularioProducto from "./components/FormularioProducto";
import ProductoCard from "./components/ProductoCard";
import ResumenInventario from "./components/ResumenInventario";

const LOCAL_STORAGE_KEY = "productos_inventario_adso";

export default function App() {
  // Cargar productos iniciales desde localStorage (Persistencia)
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem(LOCAL_STORAGE_KEY);
      return guardados ? JSON.parse(guardados) : [];
    } catch (e) {
      console.error("Error al cargar localStorage:", e);
      return [];
    }
  });

  // Guardar en localStorage cuando el arreglo cambie
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productos));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
  }, [productos]);

  // 7.3 Agregar productos sin modificar directamente el estado
  const agregarProducto = (nuevoProducto) => {
    setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
  };

  // 7.5 Eliminar productos con filter() mediante id
  const eliminarProducto = (id) => {
    setProductos((prevProductos) =>
      prevProductos.filter((producto) => producto.id !== id)
    );
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">Sistema de Gestión de Inventario</h1>
        <p className="subtitulo">
          Control de existencias, cálculo de activos y responsabilidad ADSO
        </p>
      </header>

      {/* 7.6 Resumen del inventario en la parte superior */}
      <ResumenInventario productos={productos} />

      <div className="main-layout">
        {/* 7.1 Formulario de registro */}
        <section className="form-section">
          <FormularioProducto onAgregar={agregarProducto} />
        </section>

        {/* 7.4 y 7.7 Sección de Lista de productos */}
        <section className="list-section">
          <h2 className="section-titulo">
            Productos Registrados ({productos.length})
          </h2>

          {productos.length === 0 ? (
            // 7.7 Estado vacío obligatorio
            <div className="estado-vacio">
              <span className="vacio-icon">📦</span>
              <p className="vacio-texto">
                No hay productos registrados en el inventario
              </p>
            </div>
          ) : (
            // 7.4 Renderizado con map() y ProductoCard con key única
            <div className="productos-grid">
              {productos.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onEliminar={eliminarProducto}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
