(function () {
  var R = document.getElementById("detalle");
  var p = Carrito.prod(new URLSearchParams(location.search).get("id"));
  if (!p) { R.innerHTML = '<h1>Producto no encontrado</h1><p><a href="index.html">← Volver al catálogo</a></p>'; return; }
  document.title = p.nombre + " · Bavaria";
  R.innerHTML = '<div class="dos detalle-anim">' + Carrito.visual(p).replace('class="vis"', 'class="vis grande"') +
    "<div><small class='cat-tag'>" + p.categoria + " · " + p.id + "</small><h1>" + p.nombre + "</h1><p class='desc-prod'>" + p.descripcion + "</p><h2 style='color:var(--az);font-size:28px;margin:16px 0'>" + Carrito.fmt(p.precio) +
    '</h2><button class="btn" id="agregar">Agregar al carrito 🛒</button><div id="msg"></div><p style="margin-top:24px"><a href="index.html">← Seguir comprando</a></p></div></div>';
  Analitica.evento("view_item", { value: p.precio, items: [Carrito.item(p, 1, 0, false)] });
  document.getElementById("agregar").onclick = function () {
    Carrito.cambiar(p.id, 1);
    Analitica.evento("add_to_cart", { value: p.precio, items: [Carrito.item(p, 1, 0, false)] });
    var msg = document.getElementById("msg");
    msg.innerHTML = '<div class="toast-agregado"><span class="toast-check">✓</span> ¡Agregado al carrito! <a href="carrito.html" class="enlace-toast">Ver carrito →</a></div>';
  };
})();
