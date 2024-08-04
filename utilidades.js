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
