// juego.js — robusto: espera a DOMContentLoaded y añade listeners a .shop-item

document.addEventListener('DOMContentLoaded', () => {
  // --- Estado ---
    let puntos = 0;
    let puntosPorClick = 1;

  // --- Referencias DOM ---
    const puntosSpan = document.getElementById('puntos');
    const clickerBtn = document.getElementById('clicker');
    const tiendaItems = document.querySelectorAll('.shop-item');

  // --- Comprobaciones iniciales ---
    if (!puntosSpan) console.error('No se encontró #puntos en el DOM.');
    if (!clickerBtn) console.error('No se encontró #clicker en el DOM.');
    if (tiendaItems.length === 0) console.warn('No se encontraron elementos .shop-item (length = 0).');

  // --- Helpers ---
    function actualizarPuntos() {
    if (puntosSpan) puntosSpan.textContent = puntos;
    }

    function showToast(text) {
        const t = document.createElement('div');
        t.textContent = text;
        Object.assign(t.style, {
            position: 'fixed', right: '20px', bottom: '20px',
            background: 'rgba(0,0,0,0.85)', color: 'white', padding: '8px 12px',
            borderRadius: '6px', fontFamily: 'monospace', zIndex: 9999
        });
        document.body.appendChild(t);
        setTimeout(()=> t.style.opacity = '0', 1600);
        setTimeout(()=> t.remove(), 2000);
    }

  // --- Click principal ---
    if (clickerBtn) {
        clickerBtn.addEventListener('click', () => {
        puntos += puntosPorClick;
        actualizarPuntos();
        console.log('Click reciclaje → puntos:', puntos, 'ppc:', puntosPorClick);
    });
    }

  // --- Tienda: listeners individuales ---
    tiendaItems.forEach(item => {
    // mejorar accesibilidad/semántica si no lo cambias en HTML
        if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
        if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');

    // click handler
        item.addEventListener('click', comprarItem);
    // soporte teclado: Enter / Space
        item.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                comprarItem.call(item, ev);
        }
    });

    function comprarItem(ev) {
        const costoAttr = this.getAttribute('data-cost');
        const poderAttr = this.getAttribute('data-power');
        const costo = costoAttr ? parseInt(costoAttr, 10) : NaN;
        const poder = poderAttr ? parseInt(poderAttr, 10) : 0;

        console.log('Intento comprar', this.id, 'costo=', costo, 'poder=', poder, 'tienes=', puntos);

        if (isNaN(costo)) {
            console.warn('Item sin data-cost válido:', this);
            return;
        }

        if (puntos < costo) {
        // feedback de error
            this.animate([{ transform: 'translateX(-6px)'}, { transform: 'translateX(6px)'}, { transform: 'translateX(0)'}], { duration: 180 });
            showToast(`Necesitas ${costo} puntos para comprar ${this.id}`);
            return;
        }

      // aplicar compra: descontar y aumentar ppc
        puntos -= costo;
        puntosPorClick += poder;
        actualizarPuntos();

      // feedback visual
        this.classList.add('bought');
        setTimeout(()=> this.classList.remove('bought'), 400);

        console.log(`Compra OK: ${this.id} — descontado ${costo} — nuevo ppc: ${puntosPorClick}`);
        showToast(`Compraste ${this.querySelector('span')?.firstChild?.textContent?.trim() || this.id} +${poder}/click`);
        }
    });

  // inicializa contador en pantalla
    actualizarPuntos();
    console.log('juego.js cargado. shop-items:', tiendaItems.length);
});

/*
const upgradeBtn = document.getElementById('upgrade');

clickerBtn.addEventListener('click', () => {
    puntos += puntosPorClick;
    puntosSpan.textContent = puntos;

    // Habilitar la mejora si alcanza 10 puntos
    if (puntos >= 10) {
        upgradeBtn.disabled = false;
    }
});

upgradeBtn.addEventListener('click', () => {
    if (puntos >= 10) {
        puntos -= 10;
        puntosPorClick += 1;
        puntosSpan.textContent = puntos;
        upgradeBtn.textContent = `Clic +${puntosPorClick} (Costo: 10)`;
        upgradeBtn.disabled = true; // se vuelve a deshabilitar hasta tener 10 puntos otra vez
    }
});
*/