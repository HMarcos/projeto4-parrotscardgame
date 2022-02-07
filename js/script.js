
/* Variáveis Globais */

// Controlam as quantidades de cartas, acertos e jogadas
let quantidadeDeCartas = 0;
let quantidadeTotalDeAcertos = 0;
let quantidadeAcertos = 0;
let quantidadeDeJogadas = 0;

// Tipos de cartas de acordo com os gifs
let tiposDeCartas = ["bobrossparrot", "explodyparrot", "fiestaparrot", "metalparrot", "revertitparrot", "tripletsparrot", "unicornparrot"];
let tipoDeCartasSelecionadas = [];
let cartas = [];

/* Cada carta criada é um objeto que contém o seu tipo 
   e uma flag indicando se ela já foi selecionada */

// Controle do Jogo 
let primeiraJogada = true;
let primeiraCartaSelecionada = null;
let divPrimeiraCarta = null;
let segundaCartaSelecionada = null;
let divSegundaCarta = null

// Flag que indica se o jogo está habilitado para jogar
let jogoHabilitado = true;

// Flag que indica o primeiro clique do jogo para iniciar o relógio
let primeiroClique = true;


// Div que representa aonde as cartas estão distribuídas
const divJogoDeCartas = document.querySelector(".jogo-de-cartas");

// Div que representa o relógio
const divRelogio = document.querySelector(".relogio");
let intervaloRelogio = null;



/* Inicializa o jogo */
function iniciarJogo() {

    // Pergunta ao usuário a quantidade de cartas
    quantidadeDeCartas = parseInt(prompt("Quantas cartas você deseja? (números pares de 4 a 14)"));

    // Valida se é um número par entre 4 e 14
    while ((quantidadeDeCartas < 4 || quantidadeDeCartas > 14) || (quantidadeDeCartas % 2 !== 0)) {
        quantidadeDeCartas = parseInt(prompt("Resposta Inválida! Tente Novamente!\nQuantas cartas você deseja? (números pares de 4 a 14)"));
    }

    // Quantidade total de acertos
    quantidadeTotalDeAcertos = quantidadeDeCartas / 2;

    // Zera o relógio
    zerarRelogio();

    // Cria as cartas
    criarCartas();
}

/* Reseta o relógio presente na página */
function zerarRelogio() {

    // Zerando o HTML do relógio
    divRelogio.innerHTML = 0;
    intervaloRelogio = null;
}


/* Seleciona e cria as cartas de maneira aleatória */
function criarCartas() {

    //Embaralha os tipos de cartas
    embaralharCartas(tiposDeCartas);

    // Seleciona os tipos de cartas que serão jogadas
    for (let i = 0; i < quantidadeDeCartas / 2; i++) {
        tipoDeCartasSelecionadas.push(tiposDeCartas[i]);
    }

    // Cria o vetor de objetos de cartas (2 cartas para cada tipo de carta)
    for (let i = 0; i < tipoDeCartasSelecionadas.length * 2; i++) {
        const carta = {
            tipo: tipoDeCartasSelecionadas[parseInt(i / 2)],
            selecionada: false
        };

        cartas.push(carta);
    }

    // Embaralha as cartas criadas
    embaralharCartas(cartas);

    // Monta as cartas no HTML
    montarCartasNoHTML()

}


/* Monta as cartas no HTML */
function montarCartasNoHTML() {

    // Zerando o HTML
    divJogoDeCartas.innerHTML = "";

    for (let i = 0; i < cartas.length; i++) {
        let carta = cartas[i];
        divJogoDeCartas.innerHTML += `
            <div data-identifier="card" class="carta" onclick="selecionarCarta(this, ${i})">
            <div data-identifier="front-face" class="parte-frontal face">
                <img src="imagens/front.png" alt="Parte Fontral da Carta">
            </div>
            <div data-identifier="back-face" class="parte-traseira face">
                <img src="imagens/${carta.tipo}.gif" alt="${carta.tipo}">
            </div>
        `;
    }
}


/* Embaralhas as cartas */
function embaralharCartas(listaDeCartas) {
    listaDeCartas.sort(comparador);
}


/* Função correspondente ao clique em uma carta .
   Responsável por implementar toda a lógica do jogo. 
*/
function selecionarCarta(divCarta, indiceCarta) {

    // Informações da carta
    indiceCarta = parseInt(indiceCarta);

    // Verifica se é o primeiro clique para habilitar o relogio
    if (primeiroClique) {
        intervaloRelogio = setInterval(atualizarRelogio, 1000);
        primeiroClique = false;
    }


    // Verifica se a carta já está virada 
    if (!cartas[indiceCarta].selecionada && jogoHabilitado) {

        // Marca a carta como selecionada
        cartas[indiceCarta].selecionada = true;

        // Vira a carta
        virarCarta(divCarta);

        // Verifica se é a primeira carta do turno
        if (primeiraJogada) {

            // Seleciona a carta
            primeiraCartaSelecionada = cartas[indiceCarta];
            divPrimeiraCarta = divCarta;

            // Indica que não é a primeira carta (vamos para a segunda)
            primeiraJogada = false;
        }
        else {

            // Seleciona a carta
            segundaCartaSelecionada = cartas[indiceCarta];
            divSegundaCarta = divCarta;

            // Caso as cartas sejam do mesmo um acerto é contabilizado
            if (primeiraCartaSelecionada.tipo === segundaCartaSelecionada.tipo) {
                quantidadeAcertos++;
                if (quantidadeAcertos == quantidadeTotalDeAcertos)
                    setTimeout(encerrarJogo, 1000);
            }

            else {
                setTimeout(desvirarCartas, 1000);

                // Desabilita as jogadas enquanto espera as cartas serem desviradas
                jogoHabilitado = false;
            }

            // Reinicia para a primeira jogado do turno
            primeiraJogada = true;
        }

        // Incrementa a quantidade de jogadas
        quantidadeDeJogadas++;
    }
}


/* Vira uma carta */
function virarCarta(divCarta) {

    // Classes para virar a carta
    const verso = divCarta.querySelector(".parte-traseira");
    const frente = divCarta.querySelector(".parte-frontal");

    // Vira a carta
    verso.classList.add("rotacionar-verso");
    frente.classList.add("rotacionar-frente");
}


/* Desvira uma carta */
function desvirarCarta(divCarta) {

    // Classes para desvirar a carta
    const verso = divCarta.querySelector(".parte-traseira");
    const frente = divCarta.querySelector(".parte-frontal");

    // Desvira a carta
    verso.classList.remove("rotacionar-verso");
    frente.classList.remove("rotacionar-frente");
}


/* Desvira as cartas caso forem encontradas cartas de diferentes tipos */
function desvirarCartas() {

    // Desvirar primeira carta
    desvirarCarta(divPrimeiraCarta);

    // Desvirar segunda carta
    desvirarCarta(divSegundaCarta);

    // Habilita as cartas para serem selecionadas
    primeiraCartaSelecionada.selecionada = false;
    segundaCartaSelecionada.selecionada = false;

    // Habilita o jogo
    jogoHabilitado = true;
}


/* Encerra o jogo quando todos os pares forem encontrados */
function encerrarJogo() {

    // Encerra o relogio
    clearInterval(intervaloRelogio);

    // Obtem o tempo de jogo
    const tempoJogado = parseInt(divRelogio.innerHTML);

    alert(`Você ganhou em ${quantidadeDeJogadas} jogadas e em ${tempoJogado} segundos!`);

    reiniciarJogo();

}


/* Pergunta se o usuário deseja reiniciar o jogo */
function reiniciarJogo() {

    let reiniciar = prompt("Deseja jogar novamente? (s ou n)");

    while (reiniciar !== "s" && reiniciar !== "n") {
        reiniciar = prompt("Resposta Inválida!\nDeseja jogar novamente? (s ou n)");
    }

    if (reiniciar === "s") {
        resetarVariaveis();
        iniciarJogo();
    }

}

/* Atualiza o relógio */
function atualizarRelogio() {
    divRelogio.innerHTML = parseInt(divRelogio.innerHTML) + 1;
}


/* Retorna um número aleatório */
function comparador() {
    return Math.random() - 0.5;
}


/* Reseta todas as variáveis do jogo */
function resetarVariaveis() {

    quantidadeDeCartas = 0;
    quantidadeTotalDeAcertos = 0;
    quantidadeAcertos = 0;
    quantidadeDeJogadas = 0;

    tiposDeCartas = ["bobrossparrot", "explodyparrot", "fiestaparrot", "metalparrot", "revertitparrot", "tripletsparrot", "unicornparrot"];
    tipoDeCartasSelecionadas = [];
    cartas = [];

    primeiraJogada = true;
    primeiraCartaSelecionada = null;
    divPrimeiraCarta = null;
    segundaCartaSelecionada = null;
    divSegundaCarta = null

    jogoHabilitado = true;

    primeiroClique = true;
}



/* Chamada da função iniciarJogo */
iniciarJogo();