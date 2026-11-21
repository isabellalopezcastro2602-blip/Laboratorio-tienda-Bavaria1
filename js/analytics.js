// Carga gtag.js (solo con ID válido) y expone: Analitica.evento y Analitica.eventoYNavegar.
(function () {
  var cfg = window.TIENDA_CONFIG || {};
  var id = String(cfg.GA_MEASUREMENT_ID || "");
  var activo = /^G-[A-Z0-9]+$/i.test(id) && id !== "G-XXXXXXXXXX";
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  if (activo) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (cfg.DEBUG_MODE) gtag("config", id, { debug_mode: true });
    else gtag("config", id);
  }
  function registrar(n, p) { if (window.Monitor) window.Monitor.log(n, p); }
  function conMoneda(p) { return Object.assign({ currency: "COP" }, p || {}); }

  // Envía un evento (y lo muestra en el monitor).
  function evento(nombre, params) {
    var p = conMoneda(params);
    registrar(nombre, p);
    if (activo) gtag("event", nombre, p);
  }

  // Envía un evento y luego navega (event_callback, timeout 1000 ms, respaldo 1200 ms).
  function eventoYNavegar(nombre, params, url) {
    var p = conMoneda(params), listo = false;
    function ir() { if (!listo) { listo = true; window.location.href = url; } }
    registrar(nombre, p);
    if (!activo) { ir(); return; }
    gtag("event", nombre, Object.assign({}, p, { event_callback: ir, event_timeout: 1000 }));
    setTimeout(ir, 1200);
  }
  window.Analitica = { activo: activo, id: id, debug: !!cfg.DEBUG_MODE, evento: evento, eventoYNavegar: eventoYNavegar };
})();
