// juego.js — control de tienda + avance de niveles
document.addEventListener('DOMContentLoaded', () => {
    const INIT = window.__INIT__ || {};
    let puntos = Number(INIT.puntos) || 0;
    let puntosPorClick = Number(INIT.click_power) || 1;

    const puntosSpan = document.getElementById('puntos');
    const clickerBtn = document.getElementById('clicker');
    const tiendaItems = document.querySelectorAll('.shop-item');

    // Mensajes (IDs deben coincidir con el HTML)
    const mensajes = {
        carbono: { titulo: "Captura de Carbono", texto: "Atrapa CO₂ y reduce el calentamiento global." },
        solar:   { titulo: "Energía Solar",       texto: "Produce energía limpia y disminuye el uso de combustibles fósiles." },
        buses:   { titulo: "Transporte Eléctrico",texto: "Reduce smog y ruido, mejora la calidad del aire." },
        techos:  { titulo: "Techos Verdes",       texto: "Absorben CO₂ y enfrían la ciudad." },
        agua:    { titulo: "Ahorro de Agua",      texto: "Menor consumo y menor gasto energético de tratamiento." },
        luces:   { titulo: "Luces LED",           texto: "Ahorran energía y duran mucho más." }
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
            // Si el backend cambió el template, redirige
            if (data.template_actual) {
                const destino = `/${data.template_actual}`;
                // Evita recargar si ya estás en ese template
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
            if (isNaN(costo) || puntos < costo) return;

            puntos -= costo;
            puntosPorClick += (isNaN(poder) ? 0 : poder);
            actualizarPuntos();

            // Muestra el mensaje en el panel lateral (info-box)
            const infoBox = document.getElementById('info-box');
            const infoTitle = document.getElementById('info-title');
            const infoText = document.getElementById('info-text');
            const msg = mensajes[this.id];
            if (infoBox && infoTitle && infoText && msg) {
                infoTitle.textContent = msg.titulo;
                infoText.textContent  = msg.texto;
                infoBox.classList.remove('hidden');
            }

            // Envía la mejora al backend (para cambio de template si corresponde)
            guardarProgreso(this.id);
        }
    });

    actualizarPuntos();
});
