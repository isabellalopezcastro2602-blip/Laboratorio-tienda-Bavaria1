(function () {
  var LISTA = { item_list_id: "catalogo_principal", item_list_name: "Catálogo principal" };
  var cont = document.getElementById("productos");
  cont.innerHTML = PRODUCTOS.map(function (p, idx) {
    return '<a class="tarjeta" href="producto.html?id=' + p.id + '" data-id="' + p.id + '" style="--card-idx:' + idx + '">' + Carrito.visual(p) +
      '<div class="inf"><small class="cat-tag">' + p.categoria + "</small><h3>" + p.nombre + "</h3><p><b>" + Carrito.fmt(p.precio) + "</b></p></div></a>";
  }).join("");
  Analitica.evento("view_item_list", Object.assign({}, LISTA, { items: PRODUCTOS.map(function (p, i) { return Carrito.item(p, 1, i, false); }) }));

  Array.prototype.forEach.call(cont.querySelectorAll(".tarjeta"), function (a, i) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      Analitica.eventoYNavegar("select_item", Object.assign({}, LISTA, { items: [Carrito.item(PRODUCTOS[i], 1, i, false)] }), a.getAttribute("href"));
    });
  });

  // Banner del cupón
  var promo = {
    promotion_id: "BIENVENIDA10", promotion_name: "Cupón de bienvenida 10 %",
    creative_name: "banner_inicio_bienvenida", creative_slot: "inicio_superior",
    items: PRODUCTOS.slice(0, 2).map(function (p, i) { return Carrito.item(p, 1, i, true); })
  };
  var b = document.getElementById("banner");
  b.innerHTML = '<div><small>Oferta Especial</small><h2>10 % de descuento con BIENVENIDA10</h2><p>Aplica tu cupón con un solo clic y pruébalo en el carrito.</p></div><span class="btn">Aplicar cupón →</span>';
  Analitica.evento("view_promotion", promo);
  function usar() { Carrito.aplicarCupon("BIENVENIDA10"); Analitica.eventoYNavegar("select_promotion", promo, "carrito.html"); }
  b.addEventListener("click", usar);
  b.addEventListener("keydown", function (e) { if (e.key === "Enter") usar(); });
})();
