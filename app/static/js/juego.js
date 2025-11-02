// juego.js — versión limpia SIN mejorasObj
document.addEventListener('DOMContentLoaded', () => {
    // --- Estado inicial recibido desde Django ---
    const INIT = window.__INIT__ || {};
    let puntos = (typeof INIT.puntos === "number") ? INIT.puntos : 0;
    let puntosPorClick = (typeof INIT.click_power === "number") ? INIT.click_power : 1;
    let cantidadItems = 0;

    const puntosSpan = document.getElementById('puntos');
    const clickerBtn = document.getElementById('clicker');
    const tiendaItems = document.querySelectorAll('.shop-item');
    const contadorItems = document.querySelectorAll('.cantidad')
    //llaman clases e ID de /game para usar
    
    function actualizarPuntos() {
        if (puntosSpan) puntosSpan.textContent = puntos;
    }

    function actualizarCantidad(){
        if (contadorItems) contadorItems.textContent="Incremento"+toString(cantidadItems);
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
        setTimeout(() => t.style.opacity = '0', 1600);
        setTimeout(() => t.remove(), 2000);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    //guarda puntos, click_power y template
    function guardarProgreso() {
        fetch("/guardar/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                puntos: puntos,
                click_power: puntosPorClick,
                template_actual: "game.html"
            })
        })
        .then(res => res.json())
        .then(data => console.log("Progreso guardado:", data))
        .catch(err => console.error("Error guardando progreso:", err));
    }

    // boton principal
    if (clickerBtn) {
        clickerBtn.addEventListener('click', () => {
            puntos += puntosPorClick;
            actualizarPuntos();
            guardarProgreso();
            console.log('Click → puntos:', puntos, ' | ppc:', puntosPorClick);
        });
    }

    // manejo de tienda
    tiendaItems.forEach(item => {

        item.addEventListener('click', comprarItem);
        item.addEventListener('keydown', ev => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                comprarItem.call(item, ev);
            }
        });

        //llama las variables de costo, incremento y cantidad
        function comprarItem() {
            const costo = parseInt(this.getAttribute('data-cost'), 10);
            const poder = parseInt(this.getAttribute('data-power'), 10);
            let contador = parseInt(this.getAttribute('data-contador'), 0);
            if (isNaN(costo)) return;

            //compra fallida, shackey shake
            if (puntos < costo) {
                this.animate(
                    [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
                    { duration: 250 }
                );
                showToast(`Necesitas ${costo} puntos`);
                return;
            }

            // aplica compra
            puntos -= costo;
            puntosPorClick += (isNaN(poder) ? 0 : poder);
            cantidadItems= contador + 1;
            actualizarPuntos();
            actualizarCantidad();
            guardarProgreso();


            // feedback visual
            this.classList.add('bought');
            setTimeout(() => this.classList.remove('bought'), 400);
            //agregar anim del num de cantidad para cada compra


            console.log(`✅ Compraste ${this.id} → nuevo PPC: ${puntosPorClick}`);
            showToast(`Mejora aplicada! +${poder}/click`);
        }
    });

    // inicializar UI
    actualizarPuntos();
    console.log("✅ juego.js cargado");
});
