(function () {
  var R = document.getElementById("carrito");
  function pintar() {
    var ls = Carrito.lineas();
    if (!ls.length) {
      R.innerHTML = '<div class="detalle-anim" style="text-align:center;padding:48px 20px"><p style="font-size:18px;color:var(--tx-muted);margin-bottom:20px">Tu carrito está vacío actualmente.</p><a class="btn" href="index.html">← Explorar catálogo</a></div>';
      return;
    }
    var r = Carrito.resumen(), bruto = ls.reduce(function (a, l) { return a + Carrito.prod(l.id).precio * l.qty; }, 0);
    R.innerHTML = '<div class="dos detalle-anim"><div>' + ls.map(function (l) {
      var p = Carrito.prod(l.id);
      return '<div class="caja fila"><div><b>' + p.nombre + "</b><br><small style='color:var(--tx-muted)'>" + Carrito.fmt(p.precio) + " c/u</small></div><div class='ctl'>" +
        '<button data-a="dec" data-id="' + p.id + '" title="Restar uno">−</button><span style="min-width:24px;text-align:center;font-weight:700">' + l.qty + '</span><button data-a="inc" data-id="' + p.id +
        '" title="Sumar uno">+</button><button data-a="del" data-id="' + p.id + '" class="btn-del" title="Eliminar del carrito">Quitar</button></div></div>';
    }).join("") + '</div><aside class="caja"><h2>Resumen del carrito</h2><div class="fila"><span>Productos</span><span>' + Carrito.fmt(bruto) + "</span></div>" +
      (r.coupon ? '<div class="fila" style="color:var(--oro);font-weight:600"><span>Cupón BIENVENIDA10 (−10 %)</span><span>−' + Carrito.fmt(bruto - r.value) + "</span></div>" : "") +
      '<div class="fila tot"><span>Total productos</span><span>' + Carrito.fmt(r.value) + '</span></div><p class="nota">El valor de envío se calculará en el siguiente paso.</p>' +
      (r.coupon ? '<button class="enlace" data-a="qc">✕ Quitar cupón</button>' :
        '<label>Cupón de descuento<input id="cup" placeholder="BIENVENIDA10"></label><button class="btn sec" data-a="cup" style="margin-top:6px">Aplicar cupón</button><p id="cerr" class="err"></p>') +
      '<div style="margin-top:18px"><a class="btn" href="checkout.html">Continuar al checkout →</a></div></aside></div>';
  }
  R.addEventListener("click", function (e) {
    var a = e.target.getAttribute("data-a"), id = e.target.getAttribute("data-id");
    if (!a) return;
    var p = id && Carrito.prod(id), l = id && Carrito.lineas().filter(function (x) { return x.id === id; })[0];
    if (a === "inc") { Carrito.cambiar(id, 1); Analitica.evento("add_to_cart", { value: p.precio, items: [Carrito.item(p, 1, 0, false)] }); }
    else if (a === "dec") { Carrito.cambiar(id, -1); Analitica.evento("remove_from_cart", { value: p.precio, items: [Carrito.item(p, 1, 0, false)] }); }
    else if (a === "del") { Carrito.cambiar(id, -l.qty); Analitica.evento("remove_from_cart", { value: p.precio * l.qty, items: [Carrito.item(p, l.qty, 0, false)] }); }
    else if (a === "qc") Carrito.quitarCupon();
    else if (a === "cup") { if (!Carrito.aplicarCupon(document.getElementById("cup").value)) { document.getElementById("cerr").textContent = "Cupón no válido. Prueba con BIENVENIDA10"; return; } }
    pintar();
  });
  pintar();
  if (Carrito.lineas().length) Analitica.evento("view_cart", Carrito.resumen());
})();
