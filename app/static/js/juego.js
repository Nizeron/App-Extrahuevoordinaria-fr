// juego.js — tienda, avance de niveles, overlay + audio y toast por compra
document.addEventListener('DOMContentLoaded', () => {
  const INIT = window.__INIT__ || {};
  let puntos = Number(INIT.puntos) || 0;
  let puntosPorClick = Number(INIT.click_power) || 1;

  const puntosSpan  = document.getElementById('puntos');
  const clickerBtn  = document.getElementById('clicker');
  const tiendaItems = document.querySelectorAll('.shop-item');
  const click_powerSpan = document.getElementById('click_power');

  // --- Mensajes (para panel lateral) ---
  const mensajes = {
    carbono: { titulo: "Captura de Carbono",   texto: "Los filtros de CO₂ eliminan gases de efecto invernadero y limpian el aire." },
    solar:   { titulo: "Energía Solar",        texto: "Produce energía sin contaminar y reduce el uso de combustibles fósiles." },
    buses:   { titulo: "Transporte Eléctrico", texto: "Reduce el smog, el ruido y mejora la calidad del aire." },
    techos:  { titulo: "Techos Verdes",        texto: "Absorben CO₂, mejoran el aire y enfrían la ciudad." },
    agua:    { titulo: "Ahorro de Agua",       texto: "Evita desperdicio y reduce gasto energético en tratamiento." },
    luces:   { titulo: "Luces LED",            texto: "Usan menos energía, duran más y reducen emisiones." }
  };

  // --- Mensajes largos (overlay negro) Cambiar--- 
  const mensajesLargos = {
    carbono: "Los sistemas de captura retiran CO₂ directamente del aire, reduciendo gases que calientan el planeta. Al bajar la concentración de CO₂, se desacelera el calentamiento global y se estabiliza la temperatura.",
    solar:   "Los paneles solares generan electricidad sin quemar combustibles fósiles ni emitir CO₂. Esto disminuye la contaminación del aire y reduce el impacto climático de la energía.",
    buses:   "Los buses eléctricos no emiten humo ni partículas dañinas, mejorando la calidad del aire. Reemplazar buses diésel reduce CO₂, ruido y enfermedades respiratorias en las ciudades.",
    techos:  "La vegetación en techos atrapa CO₂ y partículas contaminantes, limpiando el aire. Además, baja la temperatura y reduce el efecto de “isla de calor” en la ciudad.",
    agua:    "Ahorrar agua reduce la energía necesaria para bombearla y tratarla, disminuyendo CO₂. También protege los recursos hídricos en tiempos de sequía y evita el desperdicio.",
    luces:   "Las luces LED consumen mucha menos energía y duran más que las ampolletas comunes. Esto reduce emisiones de CO₂ y hasta un 80% del consumo de energía en iluminación de las ciudades."
  };

  // --- UI helpers ---
  function actualizarPuntos() {
    if (puntosSpan) puntosSpan.textContent = puntos;
  }
  
  // -- Actualizar click-power --
  
  function actualizarClic_power() {
    if (click_powerSpan) click_powerSpan.textContent = puntosPorClick;
  }
  

  function showToast(text) {
    const t = document.createElement('div');
    t.textContent = text;
    Object.assign(t.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '10px 14px',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '13px',
      zIndex: 999999,
      transition: 'opacity 0.6s'
    });
    document.body.appendChild(t);
    setTimeout(() => t.style.opacity = '0', 1200);
    setTimeout(() => t.remove(), 1800);
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // --- Overlay: mostrar/ocultar ---
  function mostrarPantallaNegra(mejora) {
    const overlay = document.getElementById('level-overlay');
    const texto   = document.getElementById('overlay-text');
    const audio   = document.getElementById('overlay-sound');

    if (!overlay || !texto) {
      console.warn('[overlay] Falta el bloque #level-overlay en este template.');
      return null;
    }

    texto.textContent = mensajesLargos[mejora] || "Mejora aplicada a la ciudad...";
    overlay.style.display = 'flex';      // visible
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.textAlign = 'center';

    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = 0.85;
        audio.play().catch(() => {/* ignore autoplay errors */});
      } catch (_) {}
    }
    return overlay;
  }

  function ocultarPantallaNegra() {
    const overlay = document.getElementById('level-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // --- Guardar estado en backend ---
  async function guardarProgreso(mejora = null) {
    const res = await fetch("/game/guardar/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: JSON.stringify({
        puntos: puntos,
        click_power: puntosPorClick,
        mejora: mejora
      })
    });
    const data = await res.json();
    console.log("[guardar] respuesta:", data);
    return data;
  }

  // --- Click principal ---
  if (clickerBtn) {
    clickerBtn.addEventListener('click', async () => {
      puntos += puntosPorClick;
      actualizarPuntos();
      try {
        await guardarProgreso(null); // solo guardar puntos/ppc
      } catch (e) {
        console.error("[guardar] error en click:", e);
      }
    });
  }

  // --- Tienda ---
  tiendaItems.forEach(item => {
    // accesibilidad
    if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');

    item.addEventListener('click', comprarItem);
    item.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        comprarItem.call(item, ev);
      }
    });

    async function comprarItem() {
      const id = this.id; // "carbono", "solar", etc
      const costo = parseInt(this.getAttribute('data-cost'), 10);
      const poder = parseInt(this.getAttribute('data-power'), 10);

      if (isNaN(costo) || puntos < costo) {
        showToast(`Necesitas ${costo} puntos`);
        return;
      }

      // aplicar compra
      puntos -= costo;
      puntosPorClick += (isNaN(poder) ? 0 : poder);
      actualizarClic_power();
      actualizarPuntos();

      // panel lateral info
      const msg = mensajes[id];
      const box = document.getElementById('info-box');
      if (box && msg) {
        const title = document.getElementById('info-title');
        const text  = document.getElementById('info-text');
        if (title) title.textContent = msg.titulo;
        if (text)  text.textContent  = msg.texto;
        box.classList.remove('hidden');
      }

      // ✅ TOAST de compra SIEMPRE (tu funcionalidad antigua)
      showToast(`Compraste ${msg ? msg.titulo : id}  +${poder}/click`);

      // guardar y comprobar si hay cambio de template
      try {
        const data = await guardarProgreso(id);

        // Si el backend decide avanzar de nivel, aparece overlay negro y luego redirige
        const currentTpl = window.location.pathname.replace(/^\//, '');
        if (data.template_actual && data.template_actual !== currentTpl) {
          console.log("[nivel] cambio detectado:", currentTpl, "→", data.template_actual);

          // Mostrar overlay 10s antes de avanzar
          const overlay = mostrarPantallaNegra(id);
          setTimeout(() => {
            ocultarPantallaNegra();
            window.location.href = `/${data.template_actual}`;
          }, 10000);
        } else {
          console.log("[nivel] sin cambio de template. (Puede que no sea la mejora esperada en el orden.)");
        }
      } catch (e) {
        console.error("[guardar] error en compra:", e);
      }
    }
  });

  // Inicializar UI
  actualizarClic_power();
  actualizarPuntos();
  console.log("[init] puntos:", puntos, "ppc:", puntosPorClick, "path:", window.location.pathname);
});

//ClimateClicker 