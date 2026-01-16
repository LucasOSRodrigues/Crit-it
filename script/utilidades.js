function rolarDados(quantidade, dado) {
  const fudgeOuUm = dado === "F" ? -1 : 1
  if (fudgeOuUm === -1) dado = 3

  let dadosRolados = []
  for (let i = 0; i < quantidade; i++)
    dadosRolados.push(Math.floor(Math.random() * dado) + fudgeOuUm)
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

  if (maior) ultimaRolagem.sort((a, b) => b - a)
  else ultimaRolagem.sort((a, b) => a - b)

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
      // Adiciona um valor aleatorio na frente do valor atual
      rolagens.splice(i + 1, 0, +rolarDados(1, faces))
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

const histSec = document.querySelector(".hist-content")

function exibir(resultado, formula, rolagens) {
  const blocoSec = document.createElement("section")
  const verticalDiv = document.createElement("vertical")
  const formulaDiv = document.createElement("div")
  const rolagensDiv = document.createElement("div")
  const resultadoDiv = document.createElement("div")

  blocoSec.className = "bloco"
  verticalDiv.className = "vertical"
  rolagensDiv.className = "rolagens"
  formulaDiv.className = "formula"
  resultadoDiv.className = "resultado"

  formulaDiv.innerText = formula.join("")
  rolagensDiv.innerText = lidarComRolagens(rolagens)
  resultadoDiv.innerText = resultado

  verticalDiv.append(formulaDiv, rolagensDiv)
  blocoSec.append(verticalDiv, resultadoDiv)

  histSec.insertBefore(blocoSec, histSec.firstChild)
}

function lidarComRolagens(rolls) {
  const rolagens = []
  for (let i in rolls) {
    if (typeof rolls[i] === "object") {
      rolagens.push(`[${rolls[i].join(", ")}]`)
    } else {
      rolagens.push(rolls[i])
    }
  }

  return rolagens.join(" ")
}

function mostrarPopup(resultado, formula, rolagens) {
  const popup = document.getElementById("popup")
  const popupResultado = document.querySelector(".popup-resultado")
  const popupFormula = document.querySelector(".popup-formula")
  const popupRolagens = document.querySelector(".popup-rolagens")
  const popupFechar = document.querySelector(".popup-fechar")

  popupResultado.textContent = resultado
  popupFormula.textContent = formula.join("")
  popupRolagens.textContent = lidarComRolagens(rolagens)

  popup.classList.add("mostrar")

  function fecharPopup() {
    popup.classList.remove("mostrar")
  }

  popupFechar.addEventListener("click", fecharPopup, { once: true })
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      fecharPopup()
    }
  }, { once: true })
}