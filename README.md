# Cervo · Tienda ficticia para el laboratorio de GA4

Tienda de ropa deportiva **ficticia** (Colombia, venta nacional e internacional) para el Diplomado en E-commerce y Negocios Internacionales Digitales. HTML, CSS y JavaScript puros: sin servidor, sin base de datos, sin pagos reales.

## Qué editar
Solo `js/config.js`:
- `GA_MEASUREMENT_ID`: tu ID de GA4 (`G-XXXXXXXXXX`). Con el marcador no se carga Google Analytics y el monitor muestra un aviso rojo.
- `DEBUG_MODE`: `true` para ver los eventos en GA4 > Administrar > DebugView; `false` para envío normal.

## Probar en local
`python3 -m http.server 8000` dentro de la carpeta y abre http://localhost:8000

## Monitor de eventos
Panel a la derecha (abajo en pantallas de menos de 820 px) con el estado de la conexión, el origen UTM de la primera página de la sesión y los últimos 12 eventos. "Simular nuevo visitante" borra cookies `_ga*`, carrito y sessionStorage. Prueba UTM: `index.html?utm_source=clase&utm_medium=cpc&utm_campaign=lab`.

## Eventos (12)
view_item_list, view_promotion, select_promotion, select_item, view_item, add_to_cart, remove_from_cart, view_cart, begin_checkout, add_shipping_info, add_payment_info, purchase. Todos con `currency: "COP"`; `purchase` solo una vez por pedido y `tipo_cliente` como parámetro y propiedad de usuario.

## Decisiones de diseño
- Los eventos de promoción (`view_promotion`/`select_promotion`) llevan los 8 productos a precio de lista, porque el cupón aún no está aplicado.
- Envío Nacional Estándar gratis cuando el valor de productos (ya con descuento) llega a $150.000 COP.
- El nombre del paso 1 es obligatorio, pero no se guarda ni se envía a GA4.
- Para repetir un recorrido con el banner de cupón, usa "Simular nuevo visitante".

## Publicar
1. En GitHub: **New repository** > **uploading an existing file** y arrastra el **contenido** de la carpeta (`index.html` debe quedar en la raíz) > **Commit changes**.
2. En vercel.com: **Add New > Project**, importa el repositorio, **Framework Preset: Other**, deja Build Command y Output Directory vacíos > **Deploy**.
3. Edita `js/config.js` en GitHub (ícono del lápiz) con tu ID; Vercel se redespliega solo.
