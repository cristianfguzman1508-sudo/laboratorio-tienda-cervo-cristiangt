(function () {
  var cont = document.getElementById("gracias"), ped = null;
  try { ped = JSON.parse(sessionStorage.getItem("cervo_pedido")); } catch (e) {}
  if (!ped) { cont.innerHTML = '<h1>No hay un pedido reciente</h1><p><a class="btn" href="index.html">Volver al catálogo</a></p>'; return; }

  if (!ped.enviado) {
    Analytics.setUserProps({ tipo_cliente: ped.tipo_cliente });
    var p = { transaction_id: ped.transaction_id, affiliation: ped.affiliation, value: ped.value,
              shipping: ped.shipping, tipo_cliente: ped.tipo_cliente, items: ped.items };
    if (ped.coupon) p.coupon = ped.coupon;
    Analytics.enviar("purchase", p);
    ped.enviado = true; // evita un segundo purchase al recargar
    try { sessionStorage.setItem("cervo_pedido", JSON.stringify(ped)); } catch (e) {}
    Carrito.vaciar();
  }

  cont.innerHTML = "<h1>¡Gracias por tu compra simulada!</h1>" +
    '<p class="muted">Pedido <b>' + ped.transaction_id + "</b> · cliente " + ped.tipo_cliente + "</p>" +
    ped.items.map(function (i) {
      return '<div class="fila2"><span>' + i.item_name + " × " + i.quantity + "</span><span>" + Carrito.fmt(i.price * i.quantity) + "</span></div>";
    }).join("") +
    (ped.coupon ? '<div class="fila2 ok"><span>Cupón aplicado</span><span>' + ped.coupon + "</span></div>" : "") +
    '<div class="fila2"><span>Envío</span><span>' + (ped.shipping ? Carrito.fmt(ped.shipping) : "Gratis") + "</span></div>" +
    '<div class="fila2 total"><span>Total</span><span>' + Carrito.fmt(ped.value + ped.shipping) + "</span></div>" +
    '<p><a class="btn" href="index.html">Volver al catálogo</a></p>';
})();
