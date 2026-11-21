(function () {
  var cont = document.getElementById("carrito");

  function render() {
    var l = Carrito.lineas(), t = Carrito.totales(), cup = Carrito.cupon();
    if (!l.length) { cont.innerHTML = '<div class="panel"><p>Tu carrito está vacío.</p><a class="btn" href="index.html">Ver catálogo</a></div>'; Carrito.badge(); return; }
    var filas = l.map(function (x) {
      var p = x.producto;
      return '<div class="fila"><div class="mini" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')">' + p.sigla + "</div>" +
        '<div class="fi"><b>' + p.nombre + "</b><br><span class=\"muted\">" + Carrito.fmt(Carrito.precioUnit(p)) + " c/u</span></div>" +
        '<div class="qty"><button type="button" data-a="menos" data-id="' + p.id + '" aria-label="Disminuir">−</button><span>' + x.cantidad +
        '</span><button type="button" data-a="mas" data-id="' + p.id + '" aria-label="Aumentar">+</button></div>' +
        "<div class=\"sub\">" + Carrito.fmt(Carrito.precioUnit(p) * x.cantidad) + '</div><button type="button" class="link" data-a="quitar" data-id="' + p.id + '">Quitar</button></div>';
    }).join("");
    cont.innerHTML = '<div class="cols"><div class="panel">' + filas + "</div><aside class=\"panel\"><h2>Resumen</h2>" +
      '<div class="fila2"><span>Productos</span><span>' + Carrito.fmt(t.bruto) + "</span></div>" +
      (cup ? '<div class="fila2 ok"><span>Cupón ' + cup + " (−10 %)</span><span>−" + Carrito.fmt(t.descuento) + "</span></div>" : "") +
      '<div class="fila2 total"><span>Subtotal</span><span>' + Carrito.fmt(t.valor) + "</span></div>" +
      '<p class="muted">El envío se calcula en el checkout.</p>' +
      (cup ? '<button type="button" class="link" data-a="sincupon">Quitar cupón</button>' :
        '<div class="cupon"><input id="cod" type="text" placeholder="Código de cupón" autocomplete="off"><button type="button" id="btnCupon" class="btn sec">Aplicar</button></div><p id="cmsg" class="err"></p>') +
      '<a class="btn bloque" href="checkout.html">Ir al checkout</a></aside></div>';
    Carrito.badge();
  }

  var ls = Carrito.lineas();
  render();
  if (ls.length) {
    var vc = { value: Carrito.totales().valor, items: Carrito.itemsGA() };
    if (Carrito.cupon()) vc.coupon = Carrito.cupon();
    Analytics.enviar("view_cart", vc);
  }

  cont.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var a = b.getAttribute("data-a"), id = b.getAttribute("data-id");
    if (b.id === "btnCupon") {
      if (Carrito.aplicarCupon(document.getElementById("cod").value)) render();
      else document.getElementById("cmsg").textContent = "Cupón no válido.";
      return;
    }
    if (a === "sincupon") { Carrito.quitarCupon(); render(); return; }
    if (!id) return;
    var p = window.buscarProducto(id), linea = Carrito.lineas().filter(function (x) { return x.producto.id === id; })[0];
    if (!linea) return;
    var n = a === "mas" ? 1 : (a === "menos" ? 1 : linea.cantidad);
    var idx = Carrito.lineas().indexOf(linea);
    var item = Carrito.itemGA(p, n, idx);
    if (a === "mas") {
      Carrito.agregar(id, 1);
      Analytics.enviar("add_to_cart", { value: item.price * n, items: [item] });
    } else {
      Carrito.quitar(id, n);
      Analytics.enviar("remove_from_cart", { value: item.price * n, items: [item] });
    }
    render();
  });
})();
