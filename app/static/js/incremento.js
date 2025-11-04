const bono=document.querySelectorAll('data-bono');
const puntosOG=document.getAttribute('.puntos');
let puntosTotal=0;

function getBonoTotal(){
    let bonoTotal=0;
    for (let item in bono){
        total+=parseInt(item.textContent);
    }
    return bonoTotal;
}

function guardarPuntos(bonos){
    fetch('/guardar_bonos/',{
        method:'POST',
        header:{
            "Content-Typer":"application/json",
            "X-CSRFToken": getCookie("csrftoken")
            },
        body:JSON.stringify({
            bonos:bonos
        })
    })
}

let gameTick=0;
const incBono= setInterval(() => {
    puntosTotal=bonoTotal+puntosOG;

}, 10);