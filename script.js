/* =================================
   BARALHO
================================= */

const naipes = [
  {
    nome: "Copas",
    simbolo: "♥",
    cor: "red"
  },
  {
    nome: "Ouros",
    simbolo: "♦",
    cor: "red"
  },
  {
    nome: "Espadas",
    simbolo: "♠",
    cor: "black"
  },
  {
    nome: "Paus",
    simbolo: "♣",
    cor: "black"
  }
];


const valores = [
  { nome: "4", valor: 4 },
  { nome: "5", valor: 5 },
  { nome: "6", valor: 6 },
  { nome: "7", valor: 7 },
  { nome: "Q", valor: 10 },
  { nome: "J", valor: 11 },
  { nome: "K", valor: 12 },
  { nome: "A", valor: 13 },
  { nome: "2", valor: 14 },
  { nome: "3", valor: 15 }
];


let deck = [];

let jogador = [];
let computador = [];

let cartaVirada = null;

let manilhaValor = null;

let cartaJogador = null;
let cartaComputador = null;

let jogadorVazas = 0;
let computadorVazas = 0;

let pontosJogador = 0;
let pontosComputador = 0;

let valorRodada = 1;

let turno = "jogador";

let esperandoTruco = false;

let jogoTerminou = false;


/* =================================
   ELEMENTOS
================================= */

const playerCardsEl =
  document.getElementById("playerCards");

const computerCardsEl =
  document.getElementById("computerCards");

const playedCardsEl =
  document.getElementById("playedCards");

const statusEl =
  document.getElementById("status");

const playerScoreEl =
  document.getElementById("playerScore");

const computerScoreEl =
  document.getElementById("computerScore");

const roundValueEl =
  document.getElementById("roundValue");

const sideRoundValueEl =
  document.getElementById("sideRoundValue");

const trucoBtn =
  document.getElementById("trucoBtn");

const acceptBtn =
  document.getElementById("acceptBtn");

const runBtn =
  document.getElementById("runBtn");

const newGameBtn =
  document.getElementById("newGameBtn");

const logEl =
  document.getElementById("log");


/* =================================
   EVENTOS
================================= */

trucoBtn.addEventListener(
  "click",
  pedirTruco
);

acceptBtn.addEventListener(
  "click",
  aceitarTruco
);

runBtn.addEventListener(
  "click",
  correr
);

newGameBtn.addEventListener(
  "click",
  novoJogo
);


/* =================================
   CRIAR BARALHO
================================= */

function criarBaralho() {

  deck = [];

  for (const naipe of naipes) {

    for (const valor of valores) {

      deck.push({

        nome: valor.nome,

        valor: valor.valor,

        naipe: naipe.nome,

        simbolo: naipe.simbolo,

        cor: naipe.cor

      });

    }

  }

}


/* =================================
   EMBARALHAR
================================= */

function embaralhar(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      array[i],
      array[j]
    ] = [
        array[j],
        array[i]
      ];

  }

}


/* =================================
   NOVA RODADA
================================= */

function novaRodada() {

  if (
    pontosJogador >= 12 ||
    pontosComputador >= 12
  ) {

    finalizarJogo();

    return;
  }


  criarBaralho();

  embaralhar(deck);


  jogador =
    deck.splice(0, 3);

  computador =
    deck.splice(0, 3);


  cartaVirada =
    deck.shift();


  /* =================================
     CALCULAR MANILHA
     
     Sequência:
     4 → 5
     5 → 6
     6 → 7
     7 → Q
     Q → J
     J → K
     K → A
     A → 2
     2 → 3
     3 → 4
  ================================= */

  const indiceVirada =
    valores.findIndex(
      v => v.valor === cartaVirada.valor
    );


  const proximoIndice =
    (indiceVirada + 1) % valores.length;


  manilhaValor =
    valores[proximoIndice].valor;


  cartaJogador = null;

  cartaComputador = null;


  jogadorVazas = 0;

  computadorVazas = 0;


  valorRodada = 1;


  turno =
    Math.random() < 0.5
      ? "jogador"
      : "computador";


  esperandoTruco = false;

  jogoTerminou = false;


  atualizarTela();


  log("Nova rodada começou.");


  log(
    "Virada: " +
    cartaVirada.nome +
    cartaVirada.simbolo +
    " — Manilha: " +
    getManilhaNome()
  );


  if (turno === "computador") {

    statusEl.textContent =
      "Computador começa.";

    setTimeout(
      jogadaComputador,
      700
    );

  } else {

    statusEl.textContent =
      "Sua vez.";

  }

}


/* =================================
   MANILHA
================================= */

function getManilhaNome() {

  const carta =
    valores.find(
      v => v.valor === manilhaValor
    );

  return carta
    ? carta.nome
    : "?";

}


/* =================================
   FORÇA DA CARTA
================================= */

function forcaCarta(carta) {

  if (
    carta.valor === manilhaValor
  ) {

    const forcaNaipe = {

      "Ouros": 1,

      "Espadas": 2,

      "Copas": 3,

      "Paus": 4

    };


    return (
      100 +
      forcaNaipe[carta.naipe]
    );

  }


  return carta.valor;

}


/* =================================
   CARTA HTML
================================= */

function criarCartaHTML(
  carta,
  clicavel = false
) {

  const button =
    document.createElement("button");


  button.className =
    "card " + carta.cor;


  button.type = "button";


  button.innerHTML = `

    <span class="rank">
      ${carta.nome}
    </span>

    <span class="suit">
      ${carta.simbolo}
    </span>

  `;


  if (clicavel) {

    button.addEventListener(
      "click",
      () => jogarCarta(carta)
    );

  }


  return button;

}


/* =================================
   CARTA ESCONDIDA
================================= */

function criarCartaEscondida() {

  const div =
    document.createElement("div");


  div.className =
    "card card-back";


  return div;

}


/* =================================
   ATUALIZAR TELA
================================= */

function atualizarTela() {

  playerScoreEl.textContent =
    pontosJogador;

  computerScoreEl.textContent =
    pontosComputador;


  /* Valor da rodada */

  roundValueEl.textContent =
    valorRodada > 1
      ? `(${valorRodada})`
      : "";


  sideRoundValueEl.textContent =
    valorRodada === 1
      ? "1 ponto"
      : `${valorRodada} pontos`;


  /* Limpar cartas */

  playerCardsEl.innerHTML = "";

  computerCardsEl.innerHTML = "";


  /* Cartas do jogador */

  jogador.forEach(carta => {

    const el =
      criarCartaHTML(

        carta,

        turno === "jogador" &&
        !cartaJogador &&
        !esperandoTruco &&
        !jogoTerminou

      );


    playerCardsEl.appendChild(el);

  });


  /* Cartas do computador */

  computador.forEach(() => {

    computerCardsEl.appendChild(
      criarCartaEscondida()
    );

  });


  /* Cartas jogadas */

  playedCardsEl.innerHTML = "";


  if (cartaJogador) {

    const el =
      criarCartaHTML(
        cartaJogador
      );


    el.classList.add(
      "played-card"
    );


    playedCardsEl.appendChild(el);

  }


  if (cartaComputador) {

    const el =
      criarCartaHTML(
        cartaComputador
      );


    el.classList.add(
      "played-card"
    );


    playedCardsEl.appendChild(el);

  }


  /* Botão truco */

  trucoBtn.disabled =
    jogoTerminou ||
    esperandoTruco ||
    turno !== "jogador";


  /* Botões do truco */

  if (!esperandoTruco) {

    acceptBtn.style.display =
      "none";

    runBtn.style.display =
      "none";

  }

}


/* =================================
   JOGAR CARTA
================================= */

function jogarCarta(carta) {

  if (
    turno !== "jogador" ||
    cartaJogador ||
    esperandoTruco ||
    jogoTerminou
  ) {

    return;

  }


  const index =
    jogador.indexOf(carta);


  if (index === -1)
    return;


  jogador.splice(
    index,
    1
  );


  cartaJogador =
    carta;


  log(
    "Você jogou " +
    carta.nome +
    carta.simbolo +
    "."
  );


  atualizarTela();


  if (cartaComputador) {

    resolverVaza();

  } else {

    turno = "computador";


    setTimeout(
      jogadaComputador,
      600
    );

  }

}


/* =================================
   JOGADA DO COMPUTADOR
================================= */

function jogadaComputador() {

  if (
    jogoTerminou ||
    esperandoTruco ||
    computador.length === 0
  ) {

    return;

  }


  let cartaEscolhida;


  if (cartaJogador) {

    const vencedoras =
      computador.filter(
        carta =>
          forcaCarta(carta) >
          forcaCarta(cartaJogador)
      );


    if (vencedoras.length > 0) {

      vencedoras.sort(
        (a, b) =>
          forcaCarta(a) -
          forcaCarta(b)
      );


      cartaEscolhida =
        vencedoras[0];

    } else {

      cartaEscolhida =
        computador[
        Math.floor(
          Math.random() *
          computador.length
        )
        ];

    }

  } else {

    const fortes =
      computador.filter(
        c =>
          forcaCarta(c) >= 14
      );


    if (
      fortes.length > 0 &&
      Math.random() < 0.18 &&
      valorRodada < 12
    ) {

      computadorPedeTruco();

      return;

    }


    cartaEscolhida =
      computador[
      Math.floor(
        Math.random() *
        computador.length
      )
      ];

  }


  const index =
    computador.indexOf(
      cartaEscolhida
    );


  computador.splice(
    index,
    1
  );


  cartaComputador =
    cartaEscolhida;


  log(
    "Computador jogou " +
    cartaEscolhida.nome +
    cartaEscolhida.simbolo +
    "."
  );


  atualizarTela();


  if (cartaJogador) {

    setTimeout(
      resolverVaza,
      600
    );

  } else {

    turno = "jogador";


    statusEl.textContent =
      "Sua vez.";


    atualizarTela();

  }

}


/* =================================
   RESOLVER VAZA
================================= */

function resolverVaza() {

  const forcaJogador =
    forcaCarta(cartaJogador);

  const forcaComputador =
    forcaCarta(cartaComputador);

  let vencedor;


  if (
    forcaJogador >
    forcaComputador
  ) {

    vencedor = "jogador";

  }

  else if (
    forcaComputador >
    forcaJogador
  ) {

    vencedor = "computador";

  }

  else {

    vencedor = "empate";

  }


  /* ================================
     CONTABILIZAR A VAZA
  ================================= */

  if (vencedor === "jogador") {

    jogadorVazas++;

    vencedorUltimaVaza = "jogador";

    statusEl.textContent =
      "Você ganhou a vaza!";

    log(
      "Você ganhou a vaza."
    );

  }

  else if (
    vencedor === "computador"
  ) {

    computadorVazas++;

    vencedorUltimaVaza = "computador";

    statusEl.textContent =
      "Computador ganhou.";

    log(
      "Computador ganhou a vaza."
    );

  }

  else {

    statusEl.textContent =
      "Vaza empatada.";

    log(
      "Vaza empatada."
    );

  }


  atualizarTela();


  setTimeout(() => {

    cartaJogador = null;

    cartaComputador = null;


    /* ================================
       VERIFICAR SE A RODADA TERMINOU
    ================================= */

    if (
      jogadorVazas >= 2 ||
      computadorVazas >= 2
    ) {

      finalizarRodada();

      return;

    }


    /* ================================
       DEFINIR QUEM COMEÇA A PRÓXIMA VAZA

       Se empatou, quem ganhou a vaza
       anterior continua sendo a referência.
    ================================= */

    if (vencedor === "jogador") {

      turno = "jogador";

    }

    else if (
      vencedor === "computador"
    ) {

      turno = "computador";

    }

    else if (
      vencedorUltimaVaza === "jogador"
    ) {

      turno = "jogador";

    }

    else if (
      vencedorUltimaVaza === "computador"
    ) {

      turno = "computador";

    }

    else {

      // Caso o primeiro confronto da rodada
      // tenha empatado, mantém o jogador.

      turno = "jogador";

    }


    atualizarTela();


    if (
      turno === "computador"
    ) {

      statusEl.textContent =
        "Computador joga.";

      setTimeout(
        jogadaComputador,
        600
      );

    }

    else {

      statusEl.textContent =
        "Sua vez.";

    }

  }, 900);

}



/* =================================
   FINAL DA RODADA
================================= */

function finalizarRodada() {

  let vencedor;


  if (
    jogadorVazas >
    computadorVazas
  ) {

    vencedor = "jogador";

  }

  else if (
    computadorVazas >
    jogadorVazas
  ) {

    vencedor = "computador";

  }

  else {

    vencedor = "empate";

  }


  if (vencedor === "jogador") {

    pontosJogador +=
      valorRodada;


    statusEl.textContent =
      `Você ganhou! +${valorRodada}`;


    log(
      `Você ganhou ${valorRodada} ponto(s).`
    );

  }

  else if (
    vencedor === "computador"
  ) {

    pontosComputador +=
      valorRodada;


    statusEl.textContent =
      `Computador ganhou. +${valorRodada}`;


    log(
      `Computador ganhou ${valorRodada} ponto(s).`
    );

  }

  else {

    statusEl.textContent =
      "Rodada empatada.";


    log(
      "Rodada empatada."
    );

  }


  atualizarTela();


  if (
    pontosJogador >= 12 ||
    pontosComputador >= 12
  ) {

    setTimeout(
      finalizarJogo,
      800
    );

  }

  else {

    setTimeout(
      novaRodada,
      1300
    );

  }

}


/* =================================
   TRUCO
================================= */

function proximoValorTruco() {

  if (valorRodada === 1)
    return 3;


  if (valorRodada === 3)
    return 6;


  if (valorRodada === 6)
    return 9;


  return 12;

}


function pedirTruco() {

  if (
    turno !== "jogador" ||
    esperandoTruco ||
    jogoTerminou
  ) {

    return;

  }


  if (valorRodada >= 12) {

    statusEl.textContent =
      "Já está valendo 12!";


    return;

  }


  const novoValor =
    proximoValorTruco();


  esperandoTruco = true;


  statusEl.textContent =
    `TRUCO! Vale ${novoValor}!`;


  log(
    `Você pediu TRUCO.`
  );


  atualizarTela();


  setTimeout(() => {

    const aceita =
      Math.random() < 0.78;


    esperandoTruco = false;


    if (aceita) {

      valorRodada =
        novoValor;


      statusEl.textContent =
        `Aceitou! Vale ${valorRodada}.`;


      log(
        `Computador aceitou.`
      );


      atualizarTela();

    }

    else {

      pontosJogador +=
        valorRodada;


      statusEl.textContent =
        "Computador correu!";


      log(
        "Computador correu."
      );


      atualizarTela();


      setTimeout(
        novaRodada,
        1000
      );

    }

  }, 700);

}


/* =================================
   COMPUTADOR PEDE TRUCO
================================= */

function computadorPedeTruco() {

  const novoValor =
    proximoValorTruco();


  esperandoTruco = true;


  statusEl.textContent =
    `Computador pediu TRUCO! Vale ${novoValor}.`;


  log(
    `Computador pediu TRUCO.`
  );


  acceptBtn.style.display =
    "inline-block";


  runBtn.style.display =
    "inline-block";


  atualizarTela();

}


/* =================================
   ACEITAR
================================= */

function aceitarTruco() {

  if (!esperandoTruco)
    return;


  valorRodada =
    proximoValorTruco();


  esperandoTruco = false;


  acceptBtn.style.display =
    "none";


  runBtn.style.display =
    "none";


  statusEl.textContent =
    `Você aceitou! Vale ${valorRodada}.`;


  log(
    "Você aceitou o TRUCO."
  );


  turno = "jogador";


  atualizarTela();

}


/* =================================
   CORRER
================================= */

function correr() {

  if (!esperandoTruco)
    return;


  esperandoTruco = false;


  acceptBtn.style.display =
    "none";


  runBtn.style.display =
    "none";


  pontosComputador +=
    valorRodada;


  statusEl.textContent =
    "Você correu. Computador ganhou os pontos.";


  log(
    "Você correu do TRUCO."
  );


  atualizarTela();


  setTimeout(
    novaRodada,
    1000
  );

}


/* =================================
   FINAL DO JOGO
================================= */

function finalizarJogo() {

  jogoTerminou = true;


  trucoBtn.disabled = true;


  newGameBtn.style.display =
    "inline-block";


  if (
    pontosJogador >= 12
  ) {

    statusEl.textContent =
      "VOCÊ VENCEU!";


    log(
      "Você venceu a partida!"
    );

  }

  else {

    statusEl.textContent =
      "COMPUTADOR VENCEU!";


    log(
      "Computador venceu a partida."
    );

  }


  atualizarTela();

}


/* =================================
   NOVO JOGO
================================= */

function novoJogo() {

  pontosJogador = 0;

  pontosComputador = 0;


  newGameBtn.style.display =
    "none";


  logEl.innerHTML = "";


  novaRodada();

}


/* =================================
   LOG
================================= */

function log(texto) {

  const linha =
    document.createElement("div");


  linha.textContent =
    "• " + texto;


  logEl.prepend(linha);

}


/* =================================
   INICIAR
================================= */

novaRodada();
