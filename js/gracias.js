(function () {
  var R = document.getElementById("gracias"), raw = sessionStorage.getItem("bav_pedido");
  if (!raw) { R.innerHTML = '<div class="tarjeta-gracias"><h1>No hay pedido registrado</h1><p><a href="index.html" class="btn">Volver a la tienda</a></p></div>'; return; }
  var o = JSON.parse(raw), nota;
  if (!o.enviado) {
    gtag("set", "user_properties", { tipo_cliente: o.tipo_cliente });
    var p = { transaction_id: o.transaction_id, affiliation: o.affiliation, value: o.value, shipping: o.shipping, tipo_cliente: o.tipo_cliente, items: o.items };
    if (o.coupon) p.coupon = o.coupon;
    Analitica.evento("purchase", p);
    o.enviado = true;
    sessionStorage.setItem("bav_pedido", JSON.stringify(o));
    nota = "Compra registrada con éxito en el evento purchase de GA4.";
  } else nota = "Este pedido ya se había registrado: recargar no repite el evento purchase.";
  R.innerHTML = '<div class="tarjeta-gracias detalle-anim">' +
    '<div class="icono-exito"><svg viewBox="0 0 52 52"><circle class="circulo-exito" cx="26" cy="26" r="23" fill="none"/><path class="check-exito" fill="none" d="M14 27l8 8 16-16"/></svg></div>' +
    "<h1>¡Gracias por tu compra simulada!</h1><p style='color:var(--tx-muted);font-size:15px'>Pedido <b style='color:var(--tx)'>" + o.transaction_id + "</b> · Cliente <b style='color:var(--az)'>" + o.tipo_cliente + "</b></p>" +
    '<div class="caja">' + o.items.map(function (i) { return '<div class="fila"><span>' + i.item_name + " × " + i.quantity + "</span><span>" + Carrito.fmt(i.price * i.quantity) + "</span></div>"; }).join("") +
    '<div class="fila"><span>Envío</span><span>' + Carrito.fmt(o.shipping) + '</span></div><div class="fila tot"><span>Total abonado</span><span>' + Carrito.fmt(o.value + o.shipping) +
    '</span></div></div><p class="nota" style="color:var(--ok);font-weight:600;margin:18px 0">' + nota + '</p><a class="btn" href="index.html">← Volver a la tienda</a></div>';
})();
