/* GA4 (gtag.js) + monitor de eventos didáctico.
   API pública: Analytics.enviar(nombre, params) y Analytics.enviarYNavegar(nombre, params, url). */
(function () {
  "use strict";
  var cfg = window.TIENDA_CONFIG || {};
  var ID = String(cfg.GA_MEASUREMENT_ID || "");
  var valido = /^G-[A-Z0-9]+$/.test(ID) && ID !== "G-XXXXXXXXXX";
  var KEV = "cervo_eventos", KUTM = "cervo_utm", KOCULTO = "cervo_monitor_oculto";

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  /* gtag.js solo se carga con un ID válido distinto del marcador */
  if (valido) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (cfg.DEBUG_MODE === true) gtag("config", ID, { debug_mode: true });
    else gtag("config", ID);
  }

  /* ---------- Monitor ---------- */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function fmt(n) { return "$" + Number(n).toLocaleString("es-CO"); }
  function leerEv() { try { return JSON.parse(sessionStorage.getItem(KEV)) || []; } catch (e) { return []; } }

  function resumen(n, p) {
    if (n === "page_view") return p.page_path;
    var x = [];
    if (p.promotion_id) x.push(p.promotion_id);
    if (p.item_list_name) x.push(p.item_list_name);
    if (p.transaction_id) x.push(p.transaction_id);
    if (p.items) {
      var q = p.items.reduce(function (a, i) { return a + i.quantity; }, 0);
      x.push(p.items.length + " producto(s), " + q + " ud.");
      if (p.items.length <= 2) x.push(p.items.map(function (i) { return i.item_name; }).join(", "));
    }
    if (p.value != null) x.push("valor " + fmt(p.value));
    if (p.shipping != null) x.push("envío " + fmt(p.shipping));
    if (p.coupon) x.push("cupón " + p.coupon);
    if (p.shipping_tier) x.push(p.shipping_tier);
    if (p.payment_type) x.push(p.payment_type);
    if (p.tipo_cliente) x.push(p.tipo_cliente);
    return x.join(" · ");
  }

  function log(n, p) {
    var a = leerEv();
    a.unshift({ t: new Date().toLocaleTimeString("es-CO", { hour12: false }), n: n, r: resumen(n, p || {}) });
    try { sessionStorage.setItem(KEV, JSON.stringify(a.slice(0, 12))); } catch (e) {}
    pintar();
  }

  function pintar() {
    var ol = document.getElementById("mLista"); if (!ol) return;
    var a = leerEv();
    ol.innerHTML = a.length ? a.map(function (e) {
      return '<li><span class="m-h">' + esc(e.t) + '</span> <b>' + esc(e.n) + '</b><div>' + esc(e.r) + "</div></li>";
    }).join("") : '<li class="m-vacio">Aún no hay eventos.</li>';
  }

  function borrarCookiesGA() {
    var host = location.hostname, partes = host.split("."), doms = [host, "." + host];
    for (var i = 0; i < partes.length; i++) { var d = partes.slice(i).join("."); doms.push(d, "." + d); }
    document.cookie.split(";").forEach(function (c) {
      var nombre = c.split("=")[0].trim();
      if (nombre.indexOf("_ga") !== 0) return;
      var base = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = base;
      doms.forEach(function (d) { document.cookie = base + "; domain=" + d; });
    });
  }

  function construirMonitor() {
    var u = sessionStorage.getItem(KUTM);
    if (u === null) {
      var q = new URLSearchParams(location.search), src = q.get("utm_source");
      u = src ? src + " / " + (q.get("utm_medium") || "—") + " · " + (q.get("utm_campaign") || "—") : "directo (sin UTM)";
      try { sessionStorage.setItem(KUTM, u); } catch (e) {}
    }
    var panel = document.createElement("aside");
    panel.id = "monitor";
    panel.innerHTML =
      '<div class="m-top"><strong>Monitor de eventos GA4</strong><button type="button" id="mToggle">Ocultar</button></div>' +
      '<div id="mEstado" class="m-estado ' + (valido ? "ok" : "mal") + '">' +
      (valido ? "Conectado a " + esc(ID) + (cfg.DEBUG_MODE === true ? " · modo depuración" : "")
              : "Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js.") + "</div>" +
      '<div class="m-bloque"><span class="m-et">Origen de la visita</span><div>' + esc(u) + "</div></div>" +
      '<div class="m-bloque m-lista"><span class="m-et">Últimos 12 eventos</span><ol id="mLista"></ol></div>' +
      '<button type="button" id="mReset">Simular nuevo visitante</button>';
    var mostrar = document.createElement("button");
    mostrar.type = "button"; mostrar.id = "mMostrar"; mostrar.textContent = "Mostrar monitor";
    document.body.appendChild(panel); document.body.appendChild(mostrar);

    function aplicar(oculto) {
      panel.hidden = oculto; mostrar.hidden = !oculto;
      document.body.classList.toggle("mon-off", oculto);
      try { localStorage.setItem(KOCULTO, oculto ? "1" : "0"); } catch (e) {}
    }
    var ini = false; try { ini = localStorage.getItem(KOCULTO) === "1"; } catch (e) {}
    aplicar(ini);
    document.getElementById("mToggle").onclick = function () { aplicar(true); };
    mostrar.onclick = function () { aplicar(false); };
    document.getElementById("mReset").onclick = function () {
      borrarCookiesGA();
      try { localStorage.removeItem("cervo_carrito"); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
      location.href = "index.html";
    };
    pintar();
  }

  /* ---------- API pública ---------- */
  function preparar(p) {
    var o = {}; for (var k in (p || {})) o[k] = p[k];
    if (!o.currency) o.currency = "COP";
    return o;
  }
  function enviar(nombre, params) {
    var p = preparar(params);
    gtag("event", nombre, p);
    log(nombre, p);
  }
  function enviarYNavegar(nombre, params, url) {
    var p = preparar(params), ya = false;
    function ir() { if (ya) return; ya = true; location.href = url; }
    if (!valido) { log(nombre, p); ir(); return; } // sin ID no hay nada que esperar
    p.event_callback = ir;
    p.event_timeout = 1000;
    gtag("event", nombre, p);
    log(nombre, p);
    setTimeout(ir, 1200); // respaldo si el callback nunca se ejecuta
  }
  function setUserProps(props) { gtag("set", "user_properties", props); }

  window.Analytics = { enviar: enviar, enviarYNavegar: enviarYNavegar, setUserProps: setUserProps, activo: valido };

  construirMonitor();
  log("page_view", { page_path: location.pathname.replace(/^\/$/, "/index.html"), page_title: document.title, page_location: location.href });
})();
