(function () {
  var grid = document.getElementById("grid");
  var nombreLista = "Catálogo principal";
  grid.innerHTML = window.PRODUCTOS.map(function (p) {
    return '<a class="card" href="producto.html?id=' + p.id + '" data-id="' + p.id + '">' +
      '<div class="ph" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')"><span>' + p.sigla + "</span></div>" +
      '<div class="card-b"><small>' + p.categoria + "</small><h3>" + p.nombre + "</h3><p>" + Carrito.fmt(p.precio) + "</p></div></a>";
  }).join("");

  Analytics.enviar("view_item_list", {
    item_list_id: "catalogo_principal", item_list_name: nombreLista,
    items: window.PRODUCTOS.map(function (p, i) { return Carrito.itemGA(p, 1, i); })
  });

  grid.addEventListener("click", function (e) {
    var a = e.target.closest(".card"); if (!a) return;
    e.preventDefault();
    var i = window.PRODUCTOS.map(function (p) { return p.id; }).indexOf(a.getAttribute("data-id"));
    Analytics.enviarYNavegar("select_item", {
      item_list_id: "catalogo_principal", item_list_name: nombreLista,
      items: [Carrito.itemGA(window.PRODUCTOS[i], 1, i)]
    }, a.getAttribute("href"));
  });

  /* Banner del cupón (solo si aún no está aplicado) */
  var banner = document.getElementById("banner");
  if (!Carrito.cupon()) {
    banner.hidden = false;
    var promo = {
      promotion_id: "BIENVENIDA10", promotion_name: "Bienvenida 10%",
      creative_name: "banner_inicio_bienvenida", creative_slot: "hero_inicio",
      items: window.PRODUCTOS.map(function (p, i) { return Carrito.itemGA(p, 1, i, true); })
    };
    Analytics.enviar("view_promotion", promo);
    banner.addEventListener("click", function (e) {
      e.preventDefault();
      Carrito.aplicarCupon("BIENVENIDA10");
      Analytics.enviarYNavegar("select_promotion", promo, "carrito.html");
    });
  }
})();
