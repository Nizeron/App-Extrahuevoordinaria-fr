// juego.js — versión limpia SIN mejorasObj

document.addEventListener('DOMContentLoaded', () => {
    // --- Estado inicial recibido desde Django ---
    const INIT = window.__INIT__ || {};
    let puntos = (typeof INIT.puntos === "number") ? INIT.puntos : 0;
    let puntosPorClick = (typeof INIT.click_power === "number") ? INIT.click_power : 1;

    const puntosSpan = document.getElementById('puntos');
    const clickerBtn = document.getElementById('clicker');
    const tiendaItems = document.querySelectorAll('.shop-item');
    const contadorItems = document.querySelectorAll('.cantidad');
    const incrementoItems = document.querySelectorAll('.incremento')
    //llaman clases e ID de /game para usar
    
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
        setTimeout(() => t.style.opacity = '0', 1600);
        setTimeout(() => t.remove(), 2000);
    }
    //cockies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) 
            return parts.pop().split(';').shift();
        return null; }

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

    function guardarItemStats(item, input1,input2){
        console.log('inputs', input1, input2)
        fetch("/guardar_compra/",{
            method:'POST',
            headers:{
                "Content-Typer":"application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                item: item, 
                cantidad: input1,
                incremento:input2
            })
        })
        .then(res=>res.json)
        .then(data => console.log("Progreso de stats guardado:", data))
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

    function comprarItem(e) { 
        const shopItem = e.currentTarget

        //llama las variables de costo, incremento y cantidad
        const costo = parseInt(shopItem.getAttribute('data-cost') ?? 10);
        const poder = parseInt(shopItem.getAttribute('data-power') ?? 10);
        let nombre = shopItem.getAttribute('data-nombre') ;
        let comprado = parseInt(shopItem.getAttribute('data-cantidad') ?? 0);
        let incremento = parseInt(shopItem.getAttribute('data-incremento') ?? 0);
        console.log('stats ii', isNaN(costo), comprado, incremento)
        if (isNaN(costo)) return;

        //compra fallida, shackey shake
        if (puntos < costo) {
            shopItem.animate(
                [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' },{ transform: 'translateX(-6px)' }],
                { duration: 250 }
            );
            showToast(`Necesitas ${costo-puntos} puntos`);
            return;
        }

        // aplica compra
        puntos -= costo;
        puntosPorClick += (isNaN(poder) ? 0 : poder);
        comprado += 1;
        incremento+=incremento;

        const cantElement=shopItem.querySelectorAll('.cantidad')
        const incElement=shopItem.querySelectorAll('.incremento')
  
        cantElement[0].innerText=comprado
        incElement[0].innerText=incremento
                shopItem.setAttribute('data-cantidad', comprado);
        shopItem.setAttribute('data-incremento', incremento);

        actualizarPuntos();
        guardarItemStats(nombre, comprado,incremento);
        guardarProgreso();



        // feedback visual
        shopItem.classList.add('bought');
        setTimeout(() => shopItem.classList.remove('bought'), 400);
        //agregar anim del num de cantidad para cada compra


        console.log(`Compraste ${shopItem.id} → nuevo PPC: ${puntosPorClick}`);
        showToast(`Mejora aplicada! +${poder}/click`);
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

        
 
    });

    // inicializar UI
    actualizarPuntos();
    console.log("juego.js cargado");

});
