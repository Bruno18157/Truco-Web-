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


/* =================================
   ESTADO DO JOGO
================================= */

let deck = [];

let jogador = [];
let computador = [];

let cartaVirada = null;
let manilhaValor = null;

let cartaJogador = null;
let cartaComputador = null;

let jogadorVazas = 0;
let computadorVazas = 0;


/*
  Guarda quem venceu a última vaza.

  Pode ser:
  "jogador"
  "computador"
  null

  IMPORTANTE:
  Em caso de empate, NÃO alteramos esse valor.
*/
let vencedorUltimaVaza = null;


/*
  Guarda quem venceu a primeira vaza.

  Pode ser:
  "jogador"
  "computador"
  "empate"
*/
let vencedorPrimeiraVaza = null;


/*
  Número de vazas concluídas.
*/
let numeroVaza = 0;


/*
  Guarda o resultado de CADA vaza.

  Exemplos:

  [
    "jogador",
    "empate",
    "jogador"
  ]

  ou:

  [
    "empate",
    "empate",
    "empate"
  ]
*/
let resultadosVazas = [];


/*
  Define quem começa a próxima mão.
*/
let proximoComeca = "jogador";


let pontosJogador = 0;
let pontosComputador = 0;

let valorRodada = 1;

let turno = "jogador";

let esperandoTruco = false;


/*
  Guarda quem pediu o truco.

  Pode ser:
  "jogador"
  "computador"
*/
let trucoSolicitante = null;

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


  /* =================================
     RESET DA MÃO
  ================================= */

  cartaJogador = null;
  cartaComputador = null;

  jogadorVazas = 0;
  computadorVazas = 0;

  vencedorUltimaVaza = null;

  vencedorPrimeiraVaza = null;

  numeroVaza = 0;

  resultadosVazas = [];

  valorRodada = 1;


  /*
    Define quem começa a mão.
  */

  turno = proximoComeca;


  /*
    Alterna para a próxima mão.
  */

  proximoComeca =
    proximoComeca === "jogador"
      ? "computador"
      : "jogador";


  esperandoTruco = false;
  trucoSolicitante = null;

  jogoTerminou = false;


  acceptBtn.style.display =
    "none";

  runBtn.style.display =
    "none";


  atualizarTela();


  log(
    "Nova rodada começou."
  );

  log(
    "Virada: " +
    cartaVirada.nome +
    cartaVirada.simbolo +
    " — Manilha: " +
    getManilhaNome()
  );


  if (
    turno === "computador"
  ) {

    statusEl.textContent =
      "Computador começa.";

    setTimeout(
      jogadaComputador,
      700
    );

  }

  else {

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


  /* =================================
     VALOR DA RODADA
  ================================= */

  roundValueEl.textContent =
    valorRodada > 1
      ? `(${valorRodada})`
      : "";

  sideRoundValueEl.textContent =
    valorRodada === 1
      ? "1 ponto"
      : `${valorRodada} pontos`;


  /* =================================
     LIMPAR CARTAS
  ================================= */

  playerCardsEl.innerHTML = "";
  computerCardsEl.innerHTML = "";


  /* =================================
     CARTAS DO JOGADOR
  ================================= */

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


  /* =================================
     CARTAS DO COMPUTADOR
  ================================= */

  computador.forEach(() => {

    computerCardsEl.appendChild(
      criarCartaEscondida()
    );

  });


  /* =================================
     CARTAS JOGADAS
  ================================= */

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


  /* =================================
     BOTÃO TRUCO
  ================================= */

  trucoBtn.disabled =
    jogoTerminou ||
    esperandoTruco ||
    turno !== "jogador" ||
    valorRodada >= 12;


  /* =================================
     BOTÕES DE RESPOSTA
  ================================= */

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


  if (index === -1) {

    return;

  }


  jogador.splice(
    index,
    1
  );

  cartaJogador = carta;


  log(
    "Você jogou " +
    carta.nome +
    carta.simbolo +
    "."
  );


  atualizarTela();


  /*
    Se o computador já tinha jogado,
    resolve a vaza.
  */

  if (cartaComputador) {

    resolverVaza();

  }

  else {

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


  /* =================================
     COMPUTADOR RESPONDE À CARTA
  ================================= */

  if (cartaJogador) {

    const vencedoras =
      computador.filter(
        carta =>
          forcaCarta(carta) >
          forcaCarta(cartaJogador)
      );


    if (
      vencedoras.length > 0
    ) {

      vencedoras.sort(
        (a, b) =>
          forcaCarta(a) -
          forcaCarta(b)
      );

      cartaEscolhida =
        vencedoras[0];

    }

    else {

      cartaEscolhida =
        computador[
          Math.floor(
            Math.random() *
            computador.length
          )
        ];

    }

  }


  /* =================================
     COMPUTADOR COMEÇA A VAZA
  ================================= */

  else {

    const fortes =
      computador.filter(
        c =>
          forcaCarta(c) >= 14
      );


    /*
      O computador pode pedir truco
      somente se ainda não estiver
      valendo 12.
    */

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


  /* =================================
     JOGAR CARTA
  ================================= */

  const index =
    computador.indexOf(
      cartaEscolhida
    );


  if (index === -1) {

    return;

  }


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


  if (
    cartaJogador
  ) {

    setTimeout(
      resolverVaza,
      600
    );

  }

  else {

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

  if (
    !cartaJogador ||
    !cartaComputador
  ) {

    return;

  }


  const forcaJogador =
    forcaCarta(cartaJogador);

  const forcaComputador =
    forcaCarta(cartaComputador);


  let vencedor;


  /* =================================
     DESCOBRIR VENCEDOR DA VAZA
  ================================= */

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


  /*
    Incrementa o número da vaza.
  */

  numeroVaza++;


  /*
    REGISTRA EXATAMENTE O RESULTADO
    DESTA VAZA.

    Exemplo:

    1ª = jogador
    2ª = empate
    3ª = jogador

    resultadosVazas será:

    [
      "jogador",
      "empate",
      "jogador"
    ]
  */

  resultadosVazas.push(
    vencedor
  );


  /*
    Guarda o vencedor da primeira vaza.
  */

  if (
    numeroVaza === 1
  ) {

    vencedorPrimeiraVaza =
      vencedor;

  }


  /* =================================
     CONTABILIZAR A VAZA
  ================================= */

  if (
    vencedor === "jogador"
  ) {

    jogadorVazas++;

    vencedorUltimaVaza =
      "jogador";

    statusEl.textContent =
      "Você ganhou a vaza!";

    log(
      `Você ganhou a ${numeroVaza}ª vaza.`
    );

  }

  else if (
    vencedor === "computador"
  ) {

    computadorVazas++;

    vencedorUltimaVaza =
      "computador";

    statusEl.textContent =
      "Computador ganhou a vaza.";

    log(
      `Computador ganhou a ${numeroVaza}ª vaza.`
    );

  }

  else {

    /*
      NÃO alteramos vencedorUltimaVaza.

      O resultado real do empate já está
      guardado em resultadosVazas.
    */

    statusEl.textContent =
      "Vaza empatada.";

    log(
      `A ${numeroVaza}ª vaza empatou.`
    );

  }


  atualizarTela();


  setTimeout(() => {

    cartaJogador = null;
    cartaComputador = null;


    /* =================================
       VERIFICAR VENCEDOR DA MÃO
    ================================= */

    const vencedorMao =
      determinarVencedorMao();


    if (
      vencedorMao
    ) {

      finalizarRodada(
        vencedorMao
      );

      return;

    }


    /*
      Se chegou à terceira vaza
      e ainda não existe vencedor,
      as três vazas foram empate.
    */

    if (
      numeroVaza >= 3
    ) {

      finalizarRodada(
        "empate"
      );

      return;

    }


    /* =================================
       DEFINIR QUEM COMEÇA A PRÓXIMA VAZA
    ================================= */

    if (
      vencedor === "jogador"
    ) {

      turno = "jogador";

    }

    else if (
      vencedor === "computador"
    ) {

      turno = "computador";

    }

    else {

      /*
        Se a vaza empatou, quem ganhou
        a vaza anterior começa.

        Se ainda não houve vencedor,
        mantém quem começou a mão.
      */

      if (
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

        /*
          A primeira vaza foi empate.

          Nesse caso, mantém o jogador
          que começou a mão.
        */

        turno =
          proximoComeca === "jogador"
            ? "computador"
            : "jogador";

      }

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
   DETERMINAR VENCEDOR DA MÃO
================================= */

function determinarVencedorMao() {

  /*
    Se não existe vaza,
    não há vencedor.
  */

  if (
    resultadosVazas.length === 0
  ) {

    return null;

  }


  const primeira =
    resultadosVazas[0];


  /* =================================
     SEGUNDA VAZA
  ================================= */

  if (
    resultadosVazas.length >= 2
  ) {

    const segunda =
      resultadosVazas[1];


    /*
      =================================
      1ª EMPATOU + 2ª JOGADOR
      =================================

      Jogador ganha imediatamente.
    */

    if (
      primeira === "empate" &&
      segunda === "jogador"
    ) {

      return "jogador";

    }


    /*
      =================================
      1ª EMPATOU + 2ª COMPUTADOR
      =================================
    */

    if (
      primeira === "empate" &&
      segunda === "computador"
    ) {

      return "computador";

    }


    /*
      =================================
      1ª VENCIDA PELO JOGADOR
      + 2ª EMPATE
      =================================

      Jogador ganha.
    */

    if (
      primeira === "jogador" &&
      segunda === "empate"
    ) {

      return "jogador";

    }


    /*
      =================================
      1ª VENCIDA PELO COMPUTADOR
      + 2ª EMPATE
      =================================

      Computador ganha.
    */

    if (
      primeira === "computador" &&
      segunda === "empate"
    ) {

      return "computador";

    }


    /*
      =================================
      DUAS VAZAS PARA O JOGADOR
      =================================
    */

    if (
      primeira === "jogador" &&
      segunda === "jogador"
    ) {

      return "jogador";

    }


    /*
      =================================
      DUAS VAZAS PARA O COMPUTADOR
      =================================
    */

    if (
      primeira === "computador" &&
      segunda === "computador"
    ) {

      return "computador";

    }


    /*
      Se ficou:

      jogador + computador

      ou

      computador + jogador

      precisamos da terceira vaza.
    */

  }


  /* =================================
     TERCEIRA VAZA
  ================================= */

  if (
    resultadosVazas.length >= 3
  ) {

    const terceira =
      resultadosVazas[2];


    /*
      =================================
      3ª JOGADOR
      =================================

      Jogador ganha a mão.
    */

    if (
      terceira === "jogador"
    ) {

      return "jogador";

    }


    /*
      =================================
      3ª COMPUTADOR
      =================================
    */

    if (
      terceira === "computador"
    ) {

      return "computador";

    }


    /*
      =================================
      3ª EMPATE
      =================================

      Quem venceu a primeira ganha.
    */

    if (
      terceira === "empate"
    ) {

      if (
        primeira === "jogador"
      ) {

        return "jogador";

      }


      if (
        primeira === "computador"
      ) {

        return "computador";

      }


      /*
        A primeira também empatou.

        Nesse caso verificamos a segunda.
      */

      const segunda =
        resultadosVazas[1];


      if (
        segunda === "jogador"
      ) {

        return "jogador";

      }


      if (
        segunda === "computador"
      ) {

        return "computador";

      }


      /*
        =================================
        EMPATE NAS TRÊS VAZAS
        =================================

        Ninguém ganha pontos.
      */

      return "empate";

    }

  }


  return null;

}


/* =================================
   FINAL DA RODADA
================================= */

function finalizarRodada(vencedor) {

  /*
    =================================
    TRÊS VAZAS EMPATADAS
    =================================

    Nenhuma dupla marca pontos.
  */

  if (
    vencedor === "empate"
  ) {

    statusEl.textContent =
      "As três vazas empataram! Ninguém marca pontos.";

    log(
      "As três vazas empataram. Nenhuma dupla marcou pontos."
    );


    /*
      O maço passa para o próximo jogador.

      Alterna quem começa a próxima mão.
    */

    proximoComeca =
      proximoComeca === "jogador"
        ? "computador"
        : "jogador";


    atualizarTela();


    setTimeout(
      novaRodada,
      1300
    );

    return;

  }


  /* =================================
     JOGADOR GANHOU
  ================================= */

  if (
    vencedor === "jogador"
  ) {

    pontosJogador +=
      valorRodada;

    statusEl.textContent =
      `Você ganhou! +${valorRodada}`;

    log(
      `Você ganhou ${valorRodada} ponto(s).`
    );

  }


  /* =================================
     COMPUTADOR GANHOU
  ================================= */

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


  atualizarTela();


  /* =================================
     VERIFICAR FIM DO JOGO
  ================================= */

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

  if (
    valorRodada === 1
  ) {

    return 3;

  }

  if (
    valorRodada === 3
  ) {

    return 6;

  }

  if (
    valorRodada === 6
  ) {

    return 9;

  }

  if (
    valorRodada === 9
  ) {

    return 12;

  }

  return 12;

}


/* =================================
   PEDIR TRUCO
================================= */

function pedirTruco() {

  if (
    turno !== "jogador" ||
    esperandoTruco ||
    jogoTerminou
  ) {

    return;

  }


  if (
    valorRodada >= 12
  ) {

    statusEl.textContent =
      "Já está valendo 12!";

    return;

  }


  const novoValor =
    proximoValorTruco();


  esperandoTruco = true;

  trucoSolicitante =
    "jogador";


  statusEl.textContent =
    `TRUCO! Vale ${novoValor}!`;

  log(
    "Você pediu TRUCO."
  );


  atualizarTela();


  /*
    Simula a decisão do computador.
  */

  setTimeout(() => {

    if (
      jogoTerminou
    ) {

      return;

    }


    const aceita =
      Math.random() < 0.78;


    esperandoTruco = false;


    if (
      aceita
    ) {

      valorRodada =
        novoValor;

      trucoSolicitante =
        null;


      statusEl.textContent =
        `Aceitou! Vale ${valorRodada}.`;

      log(
        "Computador aceitou."
      );


      atualizarTela();

    }

    else {

      /*
        Se o computador corre,
        o jogador recebe o valor
        atual da rodada.
      */

      trucoSolicitante =
        null;


      pontosJogador +=
        valorRodada;


      statusEl.textContent =
        "Computador correu!";

      log(
        "Computador correu."
      );


      atualizarTela();


      if (
        pontosJogador >= 12
      ) {

        setTimeout(
          finalizarJogo,
          800
        );

      }

      else {

        setTimeout(
          novaRodada,
          1000
        );

      }

    }

  }, 700);

}


/* =================================
   COMPUTADOR PEDE TRUCO
================================= */

function computadorPedeTruco() {

  if (
    valorRodada >= 12 ||
    esperandoTruco ||
    jogoTerminou
  ) {

    return;

  }


  const novoValor =
    proximoValorTruco();


  esperandoTruco = true;

  trucoSolicitante =
    "computador";


  statusEl.textContent =
    `Computador pediu TRUCO! Vale ${novoValor}.`;


  log(
    "Computador pediu TRUCO."
  );


  acceptBtn.style.display =
    "inline-block";

  runBtn.style.display =
    "inline-block";


  atualizarTela();

}


/* =================================
   ACEITAR TRUCO
================================= */

function aceitarTruco() {

  if (
    !esperandoTruco ||
    trucoSolicitante !== "computador"
  ) {

    return;

  }


  valorRodada =
    proximoValorTruco();


  esperandoTruco = false;

  trucoSolicitante = null;


  acceptBtn.style.display =
    "none";

  runBtn.style.display =
    "none";


  statusEl.textContent =
    `Você aceitou! Vale ${valorRodada}.`;


  log(
    "Você aceitou o TRUCO."
  );


  /*
    O jogador passa a jogar.
  */

  turno = "jogador";


  atualizarTela();

}


/* =================================
   CORRER
================================= */

function correr() {

  if (
    !esperandoTruco ||
    trucoSolicitante !== "computador"
  ) {

    return;

  }


  esperandoTruco = false;

  trucoSolicitante = null;


  acceptBtn.style.display =
    "none";

  runBtn.style.display =
    "none";


  /*
    Ao correr de um truco,
    o adversário recebe o valor
    que estava valendo antes do aumento.
  */

  pontosComputador +=
    valorRodada;


  statusEl.textContent =
    "Você correu. Computador ganhou os pontos.";


  log(
    "Você correu do TRUCO."
  );


  atualizarTela();


  if (
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
      1000
    );

  }

}


/* =================================
   FINAL DO JOGO
================================= */

function finalizarJogo() {

  jogoTerminou = true;

  esperandoTruco = false;

  trucoSolicitante = null;


  trucoBtn.disabled = true;


  acceptBtn.style.display =
    "none";

  runBtn.style.display =
    "none";

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

  jogoTerminou = false;

  esperandoTruco = false;

  trucoSolicitante = null;

  vencedorUltimaVaza = null;

  vencedorPrimeiraVaza = null;

  numeroVaza = 0;

  resultadosVazas = [];

  proximoComeca = "jogador";


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
