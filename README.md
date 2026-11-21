# Bavaria · Laboratorio académico de GA4

Tienda **ficticia** (HTML, CSS y JS puros) para practicar medición de e-commerce con Google Analytics 4. No procesa pagos, no usa servidor ni base de datos y no pide ni guarda correo, teléfono, documento ni datos de tarjeta.

## Configurar tu ID de GA4
Edita **solo** `js/config.js` y reemplaza `G-XXXXXXXXXX` por tu ID de medición (GA4 > Administrar > Flujos de datos). Con `DEBUG_MODE: true` verás los eventos en GA4 > Administrar > DebugView. Con el marcador, gtag.js no se carga y el monitor muestra un aviso rojo.

## Estructura
`index.html` (catálogo y banner) · `producto.html?id=BAV-001` · `carrito.html` · `checkout.html` · `gracias.html` · `css/estilos.css` · `js/` (config, analytics, monitor, productos, carrito y un archivo por página).

## Eventos (moneda siempre COP)
view_item_list · view_promotion · select_promotion · select_item · view_item · add_to_cart · remove_from_cart · view_cart · begin_checkout · add_shipping_info (shipping_tier) · add_payment_info (payment_type) · purchase (una sola vez por pedido). Propiedad de usuario: `tipo_cliente` (Nacional/Internacional).
Notas: el envío gratis (Nacional Estándar desde $150.000) se evalúa sobre el valor de productos ya con descuento. El cupón es `BIENVENIDA10` (10 %).

## Publicar
1. En GitHub: **New repository** > **uploading an existing file**, arrastra el **contenido** de la carpeta (index.html debe quedar en la raíz) > **Commit changes**.
2. En Vercel: **Add New > Project**, importa el repositorio, **Framework Preset: Other**, sin Build Command ni Output Directory > **Deploy**.
3. Para actualizar el ID: edita `js/config.js` en GitHub y Vercel redespliega solo.
