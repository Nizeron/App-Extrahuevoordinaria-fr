// --- VARIABLES GLOBALES ---
let puntos = 0;
let puntosPorClick = 1;

// --- ELEMENTOS DEL DOM ---
const puntosSpan = document.getElementById('puntos');
const clickerBtn = document.getElementById('clicker');

// --- FUNCIÓN PARA ACTUALIZAR LOS PUNTOS EN PANTALLA ---
function actualizarPuntos() {
    puntosSpan.textContent = puntos;
}

// --- EVENTO PRINCIPAL: CLICK EN EL BOTÓN DE RECICLAR ---
clickerBtn.addEventListener('click', () => {
    puntos += puntosPorClick;
    actualizarPuntos();
});

// --- CONFIGURACIÓN DE LA TIENDA ---
const tiendaItems = document.querySelectorAll('.shop-item');

tiendaItems.forEach(item => {
    item.addEventListener('click', () => {
        // Obtener el costo y el poder del botón
        const costo = parseInt(item.getAttribute('data-cost'));
        const poder = parseInt(item.getAttribute('data-power'));

        // Verificar si tiene suficientes puntos
        if (puntos >= costo) {
            puntos -= costo;             // Descuenta el costo
            puntosPorClick += poder;     // Aumenta la potencia del clic
            actualizarPuntos();          // Actualiza la pantalla

            // Efecto visual opcional (feedback)
            item.style.backgroundColor = '#0a0';
            setTimeout(() => item.style.backgroundColor = '#222', 200);
        } else {
            // Si no tiene puntos suficientes, efecto visual de error
            item.style.backgroundColor = '#a00';
            setTimeout(() => item.style.backgroundColor = '#222', 300);
        }
    });
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