document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');

    if (bgMusic) {
        bgMusic.volume = 0.4; // Ajusta volumen
        bgMusic.play().catch(() => {
            console.log("Autoplay bloqueado: espera interacción del usuario");
        });
    }

    // Si quieres, también puedes exponer funciones para pausar/reanudar
    window.toggleMusic = () => {
        if (!bgMusic) return;
        if (bgMusic.paused) bgMusic.play();
        else bgMusic.pause();
    };
});
