// juego.js — control de tienda + avance de niveles
document.addEventListener('DOMContentLoaded', () => {
    const INIT = window.__INIT__ || {};
    let puntos = Number(INIT.puntos) || 0;
    let puntosPorClick = Number(INIT.click_power) || 1;

    const puntosSpan = document.getElementById('puntos');
    const clickerBtn = document.getElementById('clicker');
    const tiendaItems = document.querySelectorAll('.shop-item');

    // ✅ TOAST RESTAURADO
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
            zIndex: 99999,
            transition: 'opacity 0.6s'
        });
        document.body.appendChild(t);
        setTimeout(() => t.style.opacity = '0', 1200);
        setTimeout(() => t.remove(), 1800);
    }

    // Mensajes (IDs deben coincidir con el HTML)
    const mensajes = {
        carbono: { titulo: "Captura de Carbono", texto: "Los filtros de captura de CO₂ ayudan a limpiar el aire y reducen gases tóxicos en la ciudad." },
        solar:   { titulo: "Energía Solar",       texto: "La luz solar genera electricidad sin contaminar y reduce combustibles fósiles." },
        buses:   { titulo: "Transporte Eléctrico",texto: "Autos y buses eléctricos reducen contaminación del aire y ruido en la ciudad." },
        techos:  { titulo: "Techos Verdes",       texto: "Las plantas en los techos absorben CO₂, mejoran la calidad del aire y bajan la temperatura urbana." },
        agua:    { titulo: "Ahorro de Agua",      texto: "Sistemas eficientes evitan desperdicio de agua y reducen el consumo energético." },
        luces:   { titulo: "Luces LED",           texto: "Consumen menos energía, duran más y reducen toneladas de CO₂ emitidas a la atmósfera." }
    };

    function actualizarPuntos() {
        if (puntosSpan) puntosSpan.textContent = puntos;
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function guardarProgreso(mejora = null) {
        fetch("/game/guardar/", {
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
        })
        .then(res => res.json())
        .then(data => {
            console.log("Guardado:", data);
            if (data.template_actual) {
                const destino = `/${data.template_actual}`;
                const current = window.location.pathname.replace(/^\//, '');
                if (current !== data.template_actual) {
                    window.location.href = destino;
                }
            }
        })
        .catch(err => console.error("Error guardando:", err));
    }

    // Click principal
    if (clickerBtn) {
        clickerBtn.addEventListener('click', () => {
            puntos += puntosPorClick;
            actualizarPuntos();
            guardarProgreso(); // sin mejora
        });
    }

    // Tienda
    tiendaItems.forEach(item => {
        item.addEventListener('click', comprarItem);
        item.addEventListener('keydown', ev => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                comprarItem.call(item, ev);
            }
        });

        function comprarItem() {
            const costo = parseInt(this.getAttribute('data-cost'), 10);
            const poder = parseInt(this.getAttribute('data-power'), 10);

            // Si no alcanza, muestra TOAST (igual que versión antigua)
            if (isNaN(costo) || puntos < costo) {
                showToast(`Necesitas ${costo} puntos`);
                return;
            }

            puntos -= costo;
            puntosPorClick += (isNaN(poder) ? 0 : poder);
            actualizarPuntos();

            // Muestra mensaje en el panel lateral
            const infoBox = document.getElementById('info-box');
            const infoTitle = document.getElementById('info-title');
            const infoText = document.getElementById('info-text');
            const msg = mensajes[this.id];
            if (infoBox && infoTitle && infoText && msg) {
                infoTitle.textContent = msg.titulo;
                infoText.textContent  = msg.texto;
                infoBox.classList.remove('hidden');
            }

            // ✅ TOAST DE COMPRA RESTAURADO
            showToast(`Compraste ${msg.titulo} +${poder}/click`);

            // Enviar a backend
            guardarProgreso(this.id);
        }
    });

    actualizarPuntos();
});
