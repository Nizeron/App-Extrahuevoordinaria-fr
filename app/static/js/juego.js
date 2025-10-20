let puntos = 0;
let puntosPorClick = 1;

const puntosSpan = document.getElementById('puntos');
const clickerBtn = document.getElementById('clicker');
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
