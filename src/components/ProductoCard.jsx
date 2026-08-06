import React from "react";

export default function ProductoCard({ producto, onEliminar }) {
  const { id, nombre, categoria, cantidad, precio, responsable, estado } =
    producto;

  // Cálculo del valor total del producto
  const valorTotalProducto = Number(cantidad) * Number(precio);

  const formatearMoneda = (val) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Clase CSS según el estado para diferenciación visual
  const getBadgeClass = (est) => {
    switch (est) {
      case "Disponible":
        return "badge-disponible";
      case "Prestado":
        return "badge-prestado";
      case "En mantenimiento":
        return "badge-mantenimiento";
      default:
        return "badge-default";
    }
  };

  return (
    <article className="producto-card">
      <div className="card-header">
        <h3 className="card-title">{nombre}</h3>
        <span className={`badge ${getBadgeClass(estado)}`}>{estado}</span>
      </div>

      <div className="card-body">
        <div className="card-item">
          <span className="item-label">📁 Categoría:</span>
          <span className="item-value">{categoria}</span>
        </div>

        <div className="card-item">
          <span className="item-label">👤 Responsable:</span>
          <span className="item-value">{responsable}</span>
        </div>

        <div className="card-item">
          <span className="item-label">📦 Cantidad:</span>
          <span className="item-value">{cantidad} unidades</span>
        </div>

        <div className="card-item">
          <span className="item-label">🏷️ Precio Unitario:</span>
          <span className="item-value">{formatearMoneda(precio)}</span>
        </div>

        <div className="card-item card-total">
          <span className="item-label">💵 Valor Total:</span>
          <strong className="item-value valor-destacado">
            {formatearMoneda(valorTotalProducto)}
          </strong>
        </div>
      </div>

      <div className="card-footer">
        <button
          className="btn-eliminar"
          onClick={() => onEliminar(id)}
          title="Eliminar producto"
        >
          🗑️ Eliminar
        </button>
      </div>
    </article>
  );
}
