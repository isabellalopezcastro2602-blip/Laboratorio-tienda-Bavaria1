// Utilidades compartidas: carrito (localStorage), cupón, ítems GA4, envío, cabecera y pie.
(function () {
  var CL = "bav_carrito", CP = "bav_cupon", COD = "BIENVENIDA10", PCT = 0.10;
  function leer() { try { return JSON.parse(localStorage.getItem(CL)) || []; } catch (e) { return []; } }
  var C = {
    cod: COD,
    fmt: function (n) { return "$" + Number(n).toLocaleString("es-CO") + " COP"; },
    prod: function (id) { return PRODUCTOS.filter(function (p) { return p.id === id; })[0]; },
    lineas: function () { return leer().filter(function (l) { return C.prod(l.id); }); },
    cantidad: function () { return C.lineas().reduce(function (a, l) { return a + l.qty; }, 0); },
    cambiar: function (id, d) {
      var l = C.lineas(), x = l.filter(function (a) { return a.id === id; })[0];
      if (x) x.qty += d; else if (d > 0) l.push({ id: id, qty: d });
      localStorage.setItem(CL, JSON.stringify(l.filter(function (a) { return a.qty > 0; })));
      C.contador();
    },
    cupon: function () { return localStorage.getItem(CP) === COD ? COD : null; },
    aplicarCupon: function (c) { if (String(c).trim().toUpperCase() === COD) { localStorage.setItem(CP, COD); return true; } return false; },
    quitarCupon: function () { localStorage.removeItem(CP); },
    vaciar: function () { localStorage.removeItem(CL); localStorage.removeItem(CP); },
    // Ítem GA4. Con cupón: price = precio unitario con descuento, discount por unidad y coupon.
    item: function (p, qty, index, conCupon) {
      var i = { item_id: p.id, item_name: p.nombre, item_brand: "Bavaria", item_category: p.categoria, price: p.precio, quantity: qty, index: index };
      if (conCupon) { var d = Math.round(p.precio * PCT); i.price = p.precio - d; i.discount = d; i.coupon = COD; }
      return i;
    },
    items: function (conCupon) { return C.lineas().map(function (l, k) { return C.item(C.prod(l.id), l.qty, k, conCupon); }); },
    valor: function (items) { return items.reduce(function (a, i) { return a + i.price * i.quantity; }, 0); },
    resumen: function () {
      var c = !!C.cupon(), items = C.items(c), o = { value: C.valor(items), items: items };
      if (c) o.coupon = COD;
      return o;
    },
    // valor = productos con descuento (el envío gratis aplica sobre este valor).
    envio: function (pais, serv, valor) {
      var tipo = pais === "Colombia" ? "Nacional" : "Internacional";
      var t = { Nacional: { "Estándar": 12000, "Express": 25000 }, Internacional: { "Estándar": 95000, "Express": 160000 } };
      var costo = t[tipo][serv];
      if (tipo === "Nacional" && serv === "Estándar" && valor >= 150000) costo = 0;
      return { tipo: tipo, costo: costo, tier: tipo + " - " + serv };
    },
    visual: function (p) {
      return '<div class="vis" style="background:linear-gradient(135deg,' + p.color[0] + "," + p.color[1] + ')"><span class="vis-sigla">' + p.sigla + "</span></div>";
    },
    contador: function () {
      var e = document.getElementById("cnt");
      if (e) {
        var num = C.cantidad();
        if (e.textContent !== String(num)) {
          e.textContent = num;
          e.classList.remove("pop");
          void e.offsetWidth; // retrigger animación
          e.classList.add("pop");
        }
      }
    }
  };
  window.Carrito = C;
  document.body.insertAdjacentHTML("afterbegin",
    '<header class="cab"><a class="marca" href="index.html"><span class="marca-corona">✦</span> Bavaria</a><nav><a href="index.html">Tienda</a><a href="carrito.html">Carrito <span id="cnt" class="badge-cnt">0</span></a></nav></header>');
  document.body.insertAdjacentHTML("beforeend",
    '<footer class="pie">Sitio académico de simulación: no procesa pagos ni guarda datos personales. Usa Google Analytics 4.</footer>');
  C.contador();
})();
