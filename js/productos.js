/* Catálogo ficticio de Cervo. Precios enteros en COP. Sin imágenes externas.
   Escala de colores moderna deportiva optimizada para contraste y atractivo visual. */
window.PRODUCTOS = [
  { id: "ABC-001", nombre: "Camiseta Aero Dry", categoria: "Camisetas", precio: 89000,
    descripcion: "Camiseta técnica ultraligera de secado rápido para correr y entrenar.", sigla: "AD", c1: "#1d4ed8", c2: "#38bdf8" },
  { id: "ABC-002", nombre: "Leggings Pulse", categoria: "Leggings", precio: 129000,
    descripcion: "Leggings de compresión media con cintura alta y costuras planas.", sigla: "LP", c1: "#7c3aed", c2: "#f43f5e" },
  { id: "ABC-003", nombre: "Short Runner", categoria: "Shorts", precio: 79000,
    descripcion: "Short liviano con forro interno y bolsillo para llaves.", sigla: "SR", c1: "#047857", c2: "#10b981" },
  { id: "ABC-004", nombre: "Cortavientos Altiplano", categoria: "Chaquetas", precio: 249000,
    descripcion: "Chaqueta cortavientos repelente al agua, plegable en su propio bolsillo.", sigla: "CA", c1: "#0f172a", c2: "#334155" },
  { id: "ABC-005", nombre: "Top Soporte Medio", categoria: "Tops", precio: 99000,
    descripcion: "Top deportivo de soporte medio con tirantes cruzados y copas removibles.", sigla: "TS", c1: "#e11d48", c2: "#f97316" },
  { id: "ABC-006", nombre: "Hoodie Andes", categoria: "Buzos", precio: 189000,
    descripcion: "Buzo con capucha en algodón peinado, interior afelpado y corte relajado.", sigla: "HA", c1: "#4338ca", c2: "#6366f1" },
  { id: "ABC-007", nombre: "Medias Pro x3", categoria: "Accesorios", precio: 45000,
    descripcion: "Pack de tres pares de medias deportivas con soporte de arco.", sigla: "MP", c1: "#d97706", c2: "#fbbf24" },
  { id: "ABC-008", nombre: "Gorra Trail", categoria: "Accesorios", precio: 59000,
    descripcion: "Gorra ligera y transpirable con banda reflectiva y ajuste trasero.", sigla: "GT", c1: "#0284c7", c2: "#0d9488" }
];
window.buscarProducto = function (id) {
  return window.PRODUCTOS.filter(function (p) { return p.id === id; })[0] || null;
};