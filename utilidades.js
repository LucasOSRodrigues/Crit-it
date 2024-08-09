const d2 = dado(2)
const d3 = dado(3)
const d4 = dado(4)
const d6 = dado(6)
const d8 = dado(8)
const d10 = dado(10)
const d12 = dado(12)
const d20 = dado(20)
const d100 = dado(100)
const dF = [-1, 0, 1]

const dados = {
  2: d2,
  3: d3,
  4: d4,
  6: d6,
  8: d8,
  10: d10,
  12: d12,
  20: d20,
  100: d100,
  F: dF,
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function dado(face) {
  let arr = []
  for (let i = 1; i <= face; i++) arr.push(i)
  return arr
}

function rolarDados(quantidade, dado) {
  let dadosRolados = []
  for (let i = 0; i < quantidade; i++) {
    dadosRolados.push(embaralhar(dado)[0])
  }
  return dadosRolados
}

function somar(arr) {
  let soma = 0
  arr.forEach((valor) => (soma += valor))
  return soma
}

function keep(resultadosCorrentes, quantidade = 1, maior = 1) {
  const ultimaRolagem = resultadosCorrentes[resultadosCorrentes.length - 1]
  const tamanhoUltimaRolagem = ultimaRolagem.length

  if (quantidade > tamanhoUltimaRolagem) quantidade = tamanhoUltimaRolagem
  if (quantidade < 0) return [0]

  if (maior) {
    ultimaRolagem.sort((a, b) => b - a)
  } else {
    ultimaRolagem.sort((a, b) => a - b)
  }

  const valoresMantidos = ultimaRolagem.slice(0, quantidade)

  return valoresMantidos.length ? valoresMantidos : [0]
}

// TODO---!!
// TODO:  Dá um jeito nessa função aq
// R = reroll rerrola quaisquer valores igual á 1 ou igual ao sufixo ou
// se o sufixo for > ou <, rerrolar todos os valores que satisfaz a condição,
// Acontece até a condição ser falsa.

// r = funciona como o R, mas ele rerrola somente 1 única vez.

// sinal pode ser "R" e "r"
// Condição pode ser 0, "=>" ou "<="
function Reroll(rolagens, faces, valor, sinal, condicao = 0) {
  let tamanhoRolagens = rolagens.length

  switch (condicao) {
    case "0":
      for (const i = 0; i < tamanhoRolagens; ) {
        if (i === valor) {
          // Adiciona um valor aleatorio na frente do valor atual
          rolagens.splice(+i, 0, +rolarDados(1, faces))

          // Aumenta o tamanhoRolagens pq o statement acima acresce a variável.
          tamanhoRolagens++
          //i += 2 pra pular o valor já criado caso sinal === "r"
          // Se sinal === "R", rerrolar o próximo numero, independente
          sinal === "R" ? i++ : (i += 2)
        }
      }
  }
}

//TESTANDO Reroll()....
let arr = [1, 2, 0, 9, 8, 7, 4, 5, 6, 3]

Reroll(arr, 10, 1, "R", 0)

// console.log(arr)
//---!!