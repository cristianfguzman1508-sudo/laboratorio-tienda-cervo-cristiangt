(function () {
  if (!Carrito.lineas().length) { location.replace("carrito.html"); return; }
  var cup = Carrito.cupon(), valor = Carrito.totales().valor;
  function conCupon(o) { if (cup) o.coupon = cup; return o; }
  function items() { return Carrito.itemsGA(); }

  var PAISES = ["Colombia", "México", "Estados Unidos", "España", "Chile", "Perú", "Argentina", "Ecuador"];
  var sel = document.getElementById("pais");
  sel.innerHTML = PAISES.map(function (p) { return "<option>" + p + "</option>"; }).join("");

  function envio() {
    var nac = sel.value === "Colombia";
    var exp = document.querySelector("input[name=servicio]:checked").value === "Express";
    var costo = nac ? (exp ? 25000 : (valor >= 150000 ? 0 : 12000)) : (exp ? 160000 : 95000);
    return { tier: (nac ? "Nacional" : "Internacional") + " - " + (exp ? "Express" : "Estándar"), costo: costo, tipo: nac ? "Nacional" : "Internacional" };
  }
  function resumen() {
    var e = envio(), t = Carrito.totales();
    document.getElementById("envioInfo").textContent = e.tier + ": " + (e.costo === 0 ? "gratis" : Carrito.fmt(e.costo));
    document.getElementById("resumen").innerHTML =
      '<div class="fila2"><span>Productos</span><span>' + Carrito.fmt(t.bruto) + "</span></div>" +
      (cup ? '<div class="fila2 ok"><span>Cupón ' + cup + "</span><span>−" + Carrito.fmt(t.descuento) + "</span></div>" : "") +
      '<div class="fila2"><span>Envío</span><span>' + (e.costo === 0 ? "Gratis" : Carrito.fmt(e.costo)) + "</span></div>" +
      '<div class="fila2 total"><span>Total</span><span>' + Carrito.fmt(valor + e.costo) + "</span></div>";
  }
  sel.onchange = resumen;
  Array.prototype.forEach.call(document.querySelectorAll("input[name=servicio]"), function (r) { r.onchange = resumen; });
  resumen();

  Analytics.enviar("begin_checkout", conCupon({ value: valor, items: items() }));

  var paso1 = document.getElementById("paso1"), paso2 = document.getElementById("paso2");
  var envioElegido = null;

  document.getElementById("btnEnvio").onclick = function () {
    var nombre = document.getElementById("nombre").value.trim();
    if (!nombre) { document.getElementById("err1").textContent = "Escribe un nombre ficticio para continuar."; return; }
    document.getElementById("err1").textContent = "";
    envioElegido = envio();
    Analytics.setUserProps({ tipo_cliente: envioElegido.tipo });
    Analytics.enviar("add_shipping_info", conCupon({ value: valor, items: items(), shipping_tier: envioElegido.tier }));
    paso1.hidden = true; paso2.hidden = false;
  };
  document.getElementById("btnVolver").onclick = function () { paso2.hidden = true; paso1.hidden = false; };

  var pagando = false;
  document.getElementById("btnPagar").onclick = function () {
    if (pagando) return; pagando = true;
    this.disabled = true;
    var tipoPago = document.querySelector("input[name=pago]:checked").value;
    var its = items();
    var pedido = {
      transaction_id: "CERVO-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
      affiliation: "Cervo Tienda Online", value: valor, shipping: envioElegido.costo,
      tipo_cliente: envioElegido.tipo, items: its, enviado: false
    };
    if (cup) pedido.coupon = cup;
    try { sessionStorage.setItem("cervo_pedido", JSON.stringify(pedido)); } catch (e) {}
    Analytics.enviarYNavegar("add_payment_info", conCupon({ value: valor, payment_type: tipoPago, items: its }), "gracias.html");
  };
})();
