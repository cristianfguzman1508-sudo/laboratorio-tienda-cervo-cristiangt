(function () {
  var cont = document.getElementById("detalle");
  var p = window.buscarProducto(new URLSearchParams(location.search).get("id"));
  if (!p) { cont.innerHTML = '<div class="panel"><h2>Producto no encontrado</h2><p><a href="index.html">Volver al catálogo</a></p></div>'; return; }
  document.title = p.nombre + " · Cervo";
  var cup = Carrito.cupon();
  cont.innerHTML =
    '<div class="det"><div class="ph grande" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')"><span>' + p.sigla + "</span></div>" +
    "<div><small>" + p.categoria + " · " + p.id + "</small><h1>" + p.nombre + "</h1>" +
    '<p class="precio">' + Carrito.fmt(Carrito.precioUnit(p)) + (cup ? ' <s class="muted">' + Carrito.fmt(p.precio) + "</s>" : "") + "</p>" +
    "<p>" + p.descripcion + '</p><button id="btnAgregar" class="btn" type="button">Agregar al carrito</button>' +
    '<p id="msg" class="ok"></p><p><a href="index.html">← Seguir comprando</a> · <a href="carrito.html">Ir al carrito</a></p></div></div>';

  Analytics.enviar("view_item", { value: Carrito.precioUnit(p), items: [Carrito.itemGA(p, 1, 0)] });

  document.getElementById("btnAgregar").onclick = function () {
    Carrito.agregar(p.id, 1);
    Analytics.enviar("add_to_cart", { value: Carrito.precioUnit(p), items: [Carrito.itemGA(p, 1, 0)] });
    document.getElementById("msg").textContent = "Agregado al carrito ✓";
  };
})();
