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
  if (typeof arr === "number") return arr

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

// R = reroll rerrola quaisquer valores igual á 1 ou igual ao sufixo ou
// se o sufixo for > ou <, rerrolar todos os valores que satisfaz a condição,
// Acontece até a condição ser falsa.

// r = funciona como o R, mas ele rerrola somente 1 única vez.

/**
 * @param {number[]} rolagens - Array com os ultimos valores rolados.
 * @param {number} faces - Quantidade de faces do último dado.
 * @param {number} comparado - Número usado na comparação. Define o valor que será comparado.
 * @param {string} sinal - Pode ser "R" ou "r". Define o rerrolamento acontecerá uma única vez ou não por instância.
 * @param {string} condicao - Poder ser "", "≥" ou "≤". Representa qual comparação deve ser feita.
 * @returns {number[]}
 */
function Reroll(rolagens, faces, comparado, sinal, condicao = "") {
  // Evita um loop infinito caso uma condicao sempre seja verdadeira
  if (
    sinal == "R" &&
    // Loops infinitos so acontecem com sinal == "R"
    ((condicao === "≥" && comparado <= (faces === "F" ? -1 : 1)) ||
      // Loops acontecem quando o comparado é o número maximo de faces e a condicao é <=
      (condicao === "≤" && comparado >= (faces === "F" ? 1 : faces)))
    // ou quando o comparado é o numero mínimo e a condicao é >=
  ) {
    rolagens = [Infinity]
    return rolagens
  }

  let tamanhoRolagens = rolagens.length

  for (let i = 0; i < tamanhoRolagens; i++) {
    if (
      (rolagens[i] === +comparado && !condicao) ||
      (rolagens[i] >= comparado && condicao === "≥") ||
      (rolagens[i] <= comparado && condicao === "≤")
    ) {
      const tipoDado = dados[faces]
      // Adiciona um valor aleatorio na frente do valor atual
      rolagens.splice(
        i + 1,
        0,
        +rolarDados(1, tipoDado ? tipoDado : dado(faces))
      )
      // Aumenta o tamanhoRolagens pq o statement acima acresce a variável.
      tamanhoRolagens++
      //i++ pra pular o valor já criado caso sinal === "r"
      // Se sinal === "R", rerrolar o próximo numero, independente
      sinal === "R" ? true : i++
    }
  }
  return rolagens
}

/**
 * @returns {number[]}
 * @param {number[]} rolagens Array com os ultimos valores rolados.
 * @param {string} comparador Comparador pode ser "≥" ou "≤".
 * @param {number} comparado Numero que sera comparado.
 */

function comparar(rolagens, comparador, comparado) {
  const rolagensComparadas = []
  for (let i of rolagens) {
    if (
      (i >= comparado && comparador == "≥") ||
      (comparador === "≤" && i <= comparado)
    )
      rolagensComparadas.push(i)
  }
  return rolagensComparadas
}
