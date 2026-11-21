// Monitor de eventos (ayuda didáctica). Panel fijo a la derecha / inferior en móvil con telemetría en vivo.
(function () {
  var K = "bav_eventos", O = "bav_origen", M = "bav_mon_min";
  var A = window.Analitica || {};
  if (!sessionStorage.getItem(O)) {
    var q = new URLSearchParams(location.search), s = q.get("utm_source");
    sessionStorage.setItem(O, s ? s + " / " + (q.get("utm_medium") || "—") + " · " + (q.get("utm_campaign") || "—") : "directo (sin UTM)");
  }
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function resumen(n, p) {
    var t = [];
    if (n === "page_view") return p.page_title || "";
    if (p.item_list_name) t.push("lista: " + p.item_list_name);
    if (p.promotion_id) t.push("promo: " + p.promotion_id);
    if (p.transaction_id) t.push("pedido " + p.transaction_id);
    if (p.items) t.push(p.items.length + " ítem(s): " + p.items.map(function (i) { return i.item_name + " ×" + i.quantity; }).join(", "));
    if (p.value != null) t.push("value " + p.value);
    if (p.shipping != null) t.push("shipping " + p.shipping);
    if (p.shipping_tier) t.push(p.shipping_tier);
    if (p.payment_type) t.push(p.payment_type);
    if (p.coupon) t.push("cupón " + p.coupon);
    if (p.tipo_cliente) t.push(p.tipo_cliente);
    return t.join(" · ");
  }
  var el = document.createElement("aside");
  el.id = "monitor";
  var estado = A.activo
    ? '<div class="mon-ok">● Conectado a ' + esc(A.id) + (A.debug ? " · modo depuración" : "") + "</div>"
    : '<div class="mon-no">● Sin ID de medición: los eventos se simulan aquí localmente.</div>';
  el.innerHTML = '<div class="mon-top"><strong><span class="mon-pulse" title="Telemetría en vivo"></span>Monitor de eventos GA4</strong><button id="mon-tg" type="button"></button></div>' +
    '<div class="mon-cuerpo">' + estado +
    '<div class="mon-or"><span>Origen de la visita</span><br>' + esc(sessionStorage.getItem(O)) + "</div>" +
    '<ul id="mon-lista"></ul><button id="mon-reset" type="button">Simular nuevo visitante</button></div>';
  document.body.appendChild(el);

  function aplicar() {
    var min = localStorage.getItem(M) === "1";
    el.classList.toggle("min", min);
    document.body.classList.toggle("mon-min", min);
    document.getElementById("mon-tg").textContent = min ? "Mostrar" : "Ocultar";
  }

  function pintar() {
    var l = JSON.parse(sessionStorage.getItem(K) || "[]");
    document.getElementById("mon-lista").innerHTML = l.map(function (e, idx) {
      var cls = idx === 0 ? "mon-item mon-item-nuevo" : "mon-item";
      return "<li class='" + cls + "'><span class='h'>" + esc(e.h) + "</span> <b>" + esc(e.n) + "</b><br><small>" + esc(e.r) + "</small></li>";
    }).join("");
  }

  function log(n, p) {
    var l = JSON.parse(sessionStorage.getItem(K) || "[]");
    l.unshift({ h: new Date().toLocaleTimeString("es-CO"), n: n, r: resumen(n, p || {}) });
    sessionStorage.setItem(K, JSON.stringify(l.slice(0, 12)));
    pintar();
  }

  document.getElementById("mon-tg").onclick = function () {
    localStorage.setItem(M, localStorage.getItem(M) === "1" ? "0" : "1"); aplicar();
  };

  document.getElementById("mon-reset").onclick = function () {
    var h = location.hostname.split("."), doms = [];
    for (var i = 0; i < h.length; i++) { var d = h.slice(i).join("."); doms.push(d, "." + d); }
    document.cookie.split(";").forEach(function (c) {
      var nom = c.split("=")[0].trim();
      if (nom.indexOf("_ga") !== 0) return;
      var base = nom + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = base;
      doms.forEach(function (d) { document.cookie = base + ";domain=" + d; });
    });
    localStorage.removeItem("bav_carrito"); localStorage.removeItem("bav_cupon");
    sessionStorage.clear();
    location.href = "index.html";
  };

  window.Monitor = { log: log };
  aplicar(); pintar();
  log("page_view", { page_title: document.title, page_location: location.href });
})();
