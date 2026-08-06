import React from "react";

export default function ResumenInventario({ productos = [] }) {
  // 7.6 Resumen del inventario usando reduce()
  const totalTipos = productos.length;

  const totalUnidades = productos.reduce(
    (acc, producto) => acc + Number(producto.cantidad || 0),
    0
  );

  const valorTotal = productos.reduce(
    (acc, producto) =>
      acc + Number(producto.cantidad || 0) * Number(producto.precio || 0),
    0
  );

  const formatearMoneda = (val) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="resumen-inventario">
      <h2 className="resumen-titulo">Resumen del Inventario</h2>
      <div className="resumen-cards-grid">
        <div className="resumen-card">
          <div className="resumen-icon">📦</div>
          <div className="resumen-info">
            <span className="resumen-label">Productos Diferentes</span>
            <strong className="resumen-valor">{totalTipos}</strong>
          </div>
        </div>

        <div className="resumen-card">
          <div className="resumen-icon">🔢</div>
          <div className="resumen-info">
            <span className="resumen-label">Total Unidades</span>
            <strong className="resumen-valor">{totalUnidades}</strong>
          </div>
        </div>

        <div className="resumen-card resumen-card-destacada">
          <div className="resumen-icon">💰</div>
          <div className="resumen-info">
            <span className="resumen-label">Valor Económico Total</span>
            <strong className="resumen-valor">
              {formatearMoneda(valorTotal)}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
