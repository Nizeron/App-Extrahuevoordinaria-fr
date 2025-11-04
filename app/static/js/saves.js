export function guardarProgreso() {
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

export function guardarItemStats(item, comprado){
        console.log('guardando compra', comprado)
        fetch("/guardar_compra/",{
            method:'POST',
            headers:{
                "Content-Typer":"application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                item: item, 
                cantidad: comprado,
            })
        })
        .then(res=>res.json)
        .then(data => console.log("Progreso de stats guardado:", data))
    }

