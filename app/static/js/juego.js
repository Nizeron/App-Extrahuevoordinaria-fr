document.addEventListener("DOMContentLoaded", () => {

  // --- VARIABLES DEL JUEGO ---
  let puntos = 0;
  let puntosPorClick = 1;

  // --- ELEMENTOS DEL DOM ---
  const puntosSpan = document.getElementById("puntos");
  const botonClicker = document.getElementById("clicker");
  const itemsTienda = document.querySelectorAll(".shop-item");

  if (!botonClicker || !puntosSpan) return console.error("Elementos esenciales no encontrados");

  // --- ACTUALIZA EL CONTADOR ---
  function actualizarPuntos() {
    puntosSpan.textContent = puntos;
  }

  // --- MENSAJE TEMPORAL ---
  function mostrarMensaje(texto) {
    const mensaje = document.createElement("div");
    mensaje.textContent = texto;
    Object.assign(mensaje.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "10px 15px",
      borderRadius: "8px",
      fontFamily: "monospace",
      zIndex: 1000,
      transition: "opacity 0.5s"
    });
    document.body.appendChild(mensaje);
    setTimeout(() => mensaje.style.opacity = "0", 1500);
    setTimeout(() => mensaje.remove(), 2000);
  }

  // --- FUNCION COMPRAR ITEM ---
  function comprarItem(item) {
    const costo = parseInt(item.dataset.cost);
    const poder = parseInt(item.dataset.power);

    if (puntos < costo) {
      item.animate([{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 200 });
      mostrarMensaje(`Necesitas ${costo} puntos`);
      return;
    }

    puntos -= costo;
    puntosPorClick += poder;
    actualizarPuntos();
    mostrarMensaje(`Compraste ${item.id} (+${poder}/click)`);

    item.classList.add("comprado");
    setTimeout(() => item.classList.remove("comprado"), 400);

    guardarPuntosServidor(); // 👈 guardamos después de cada compra también
  }

  // --- EVENTO CLICK PRINCIPAL ---
  botonClicker.addEventListener("click", () => {
    puntos += puntosPorClick;
    actualizarPuntos();
    guardarPuntosServidor();
  });

  // --- EVENTOS ITEMS TIENDA ---
  itemsTienda.forEach(item => {
    item.addEventListener("click", () => comprarItem(item));
  });

  // --- FUNCION GUARDAR PUNTOS EN EL SERVIDOR ---
  function guardarPuntosServidor() {
    fetch("/app/guardar_puntos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: new URLSearchParams({ puntos })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.ok) console.error("Error guardando puntos:", data.error);
    })
    .catch(err => console.error("Error de red:", err));
  }

  // --- HELPER CSRF ---
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      document.cookie.split(";").forEach(cookie => {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        }
      });
    }
    return cookieValue;
  }

  // --- INICIALIZA ---
  actualizarPuntos();
  console.log("Juego cargado con", itemsTienda.length, "ítems en la tienda.");
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