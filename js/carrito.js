/* Carrito en localStorage + cupón BIENVENIDA10 (10 %) + ayudas para armar ítems GA4. */
(function () {
  var K = "cervo_carrito", CODIGO = "BIENVENIDA10", DTO = 0.10;
  function leer() {
    try { var d = JSON.parse(localStorage.getItem(K)); if (d && Array.isArray(d.items)) return d; } catch (e) {}
    return { items: [], cupon: null };
  }
  function guardar(d) { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} C.badge(); }
  var C = {
    CODIGO: CODIGO,
    fmt: function (n) { return "$" + Number(n).toLocaleString("es-CO") + " COP"; },
    cupon: function () { return leer().cupon; },
    aplicarCupon: function (cod) {
      if (String(cod || "").trim().toUpperCase() !== CODIGO) return false;
      var d = leer(); d.cupon = CODIGO; guardar(d); return true;
    },
    quitarCupon: function () { var d = leer(); d.cupon = null; guardar(d); },
    precioUnit: function (p, sinCupon) {
      return (!sinCupon && leer().cupon) ? Math.round(p.precio * (1 - DTO)) : p.precio;
    },
    /* Ítem GA4 según el contrato de medición. Con cupón: price con descuento + discount + coupon. */
    itemGA: function (p, cant, idx, sinCupon) {
      var cup = !sinCupon && leer().cupon;
      var it = { item_id: p.id, item_name: p.nombre, item_brand: "Cervo", item_category: p.categoria,
                 price: C.precioUnit(p, sinCupon), quantity: cant, index: idx };
      if (cup) { it.discount = p.precio - it.price; it.coupon = cup; }
      return it;
    },
    lineas: function () {
      return leer().items.map(function (i) {
        var p = window.buscarProducto(i.id); return p ? { producto: p, cantidad: i.cantidad } : null;
      }).filter(Boolean);
    },
    itemsGA: function () {
      return C.lineas().map(function (l, i) { return C.itemGA(l.producto, l.cantidad, i); });
    },
    totales: function () {
      var u = 0, bruto = 0, valor = 0;
      C.lineas().forEach(function (l) {
        u += l.cantidad; bruto += l.producto.precio * l.cantidad; valor += C.precioUnit(l.producto) * l.cantidad;
      });
      return { unidades: u, bruto: bruto, valor: valor, descuento: bruto - valor };
    },
    agregar: function (id, n) {
      var d = leer(), it = d.items.filter(function (x) { return x.id === id; })[0];
      if (it) it.cantidad += n; else d.items.push({ id: id, cantidad: n });
      guardar(d);
    },
    quitar: function (id, n) {
      var d = leer();
      d.items.forEach(function (x) { if (x.id === id) x.cantidad -= n; });
      d.items = d.items.filter(function (x) { return x.cantidad > 0; });
      guardar(d);
    },
    vaciar: function () { var d = leer(); d.items = []; guardar(d); },
    badge: function () {
      var b = document.getElementById("badge"); if (b) b.textContent = C.totales().unidades;
    }
  };
  window.Carrito = C;
  C.badge();
})();
