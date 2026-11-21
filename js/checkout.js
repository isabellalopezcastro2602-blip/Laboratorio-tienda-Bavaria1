(function () {
  var R = document.getElementById("checkout");
  if (!Carrito.lineas().length) { location.replace("carrito.html"); return; }
  var PAISES = ["Colombia", "México", "Estados Unidos", "España", "Argentina", "Chile", "Perú", "Brasil"];
  var PAGOS = ["Tarjeta de crédito", "PSE", "Nequi", "PayPal"];
  var r0 = Carrito.resumen(), envio = null;
  Analitica.evento("begin_checkout", r0);
  var $ = function (s) { return document.querySelector(s); };
  R.innerHTML = '<div class="dos detalle-anim"><div>' +
    '<section class="caja" id="p1"><h2>1 · Envío</h2><p class="nota">Usa un nombre ficticio. No ingreses datos reales.</p>' +
    '<label>Nombre ficticio<input id="nom" maxlength="40" placeholder="Ej.: Cliente Demo" autocomplete="off"></label>' +
    '<label>País<select id="pais">' + PAISES.map(function (p) { return "<option>" + p + "</option>"; }).join("") + "</select></label>" +
    '<fieldset><legend>Servicio de entrega</legend><label class="op"><input type="radio" name="serv" value="Estándar" checked> Estándar</label>' +
    '<label class="op"><input type="radio" name="serv" value="Express"> Express</label></fieldset>' +
    '<p id="costo" class="nota"></p><p id="err" class="err"></p><button class="btn" id="b1">Continuar al pago →</button></section>' +
    '<section class="caja oculto" id="p2"><h2>2 · Pago simulado</h2><p class="nota">No se piden ni guardan datos reales de pago.</p><fieldset>' +
    '<legend>Medio de pago</legend>' +
    PAGOS.map(function (p, i) { return '<label class="op"><input type="radio" name="pago" value="' + p + '"' + (i ? "" : " checked") + "> " + p + "</label>"; }).join("") +
    '</fieldset><button class="btn" id="b2">Confirmar pago simulado ✓</button></section></div><aside class="caja" id="res"></aside></div>';
  function sel() { return Carrito.envio($("#pais").value, document.querySelector("input[name=serv]:checked").value, r0.value); }
  function pintar() {
    var e = sel(), c = e.costo ? Carrito.fmt(e.costo) : "Gratis";
    $("#costo").textContent = "Envío " + e.tier + ": " + c;
    $("#res").innerHTML = "<h2>Resumen del pedido</h2>" + r0.items.map(function (i) {
      return '<div class="fila"><span>' + i.item_name + " × " + i.quantity + "</span><span>" + Carrito.fmt(i.price * i.quantity) + "</span></div>";
    }).join("") + (r0.coupon ? '<div class="fila nota"><span style="color:var(--oro);font-weight:600">Cupón BIENVENIDA10</span><span>−10% aplicado</span></div>' : "") +
      '<div class="fila"><span>Envío</span><span>' + c + '</span></div><div class="fila tot"><span>Total</span><span>' + Carrito.fmt(r0.value + e.costo) + "</span></div>";
  }
  $("#pais").onchange = pintar;
  Array.prototype.forEach.call(document.getElementsByName("serv"), function (x) { x.onchange = pintar; });
  pintar();
  $("#b1").onclick = function () {
    if (!$("#nom").value.trim()) { $("#err").textContent = "Por favor escribe un nombre ficticio para continuar."; return; }
    envio = sel();
    gtag("set", "user_properties", { tipo_cliente: envio.tipo });
    Analitica.evento("add_shipping_info", Object.assign({}, Carrito.resumen(), { shipping_tier: envio.tier }));
    ["#nom", "#pais", "#b1"].forEach(function (s) { $(s).disabled = true; });
    Array.prototype.forEach.call(document.getElementsByName("serv"), function (x) { x.disabled = true; });
    $("#p2").classList.remove("oculto");
  };
  $("#b2").onclick = function () {
    var r = Carrito.resumen(), pago = document.querySelector("input[name=pago]:checked").value;
    var pedido = {
      transaction_id: "BAV-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
      affiliation: "Bavaria", value: r.value, shipping: envio.costo, tipo_cliente: envio.tipo, items: r.items, enviado: false
    };
    if (r.coupon) pedido.coupon = r.coupon;
    sessionStorage.setItem("bav_pedido", JSON.stringify(pedido));
    Carrito.vaciar();
    Analitica.eventoYNavegar("add_payment_info", Object.assign({}, r, { payment_type: pago }), "gracias.html");
  };
})();
