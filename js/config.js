/* ==========================================================================
   CERVO · CONFIGURACIÓN (este es el ÚNICO archivo que debes editar)
   --------------------------------------------------------------------------
   1) GA_MEASUREMENT_ID: pega aquí tu ID de medición de GA4.
      Lo encuentras en GA4 > Administrar > Flujos de datos > tu flujo web >
      "ID de medición". Tiene el formato G-XXXXXXXXXX (por ejemplo G-AB12CD34EF).
      Déjalo como "G-XXXXXXXXXX" si aún no tienes ID: la tienda funciona igual,
      pero no se carga Google Analytics y los eventos solo se ven en el monitor.
   2) DEBUG_MODE: true  -> los eventos aparecen en GA4 > Administrar > DebugView.
                  false -> envío normal (no se manda debug_mode).
   ========================================================================== */
window.TIENDA_CONFIG = {
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX", // <- pega aquí tu ID de medición (entre comillas)
  DEBUG_MODE: true                   // <- true para DebugView, false para producción
};
