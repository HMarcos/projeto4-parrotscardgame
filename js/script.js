
let flag = false;

function selecionarCarta(divCarta) {
    verso = divCarta.querySelector(".parte-traseira");
    frente = divCarta.querySelector(".parte-frontal"); 
    
    if (flag) {
        verso.classList.remove("rotacionar-verso");
        frente.classList.remove("rotacionar-frente");
        
    }
    else {
        verso.classList.add("rotacionar-verso");
        frente.classList.add("rotacionar-frente");
    }

    flag = !flag;
}