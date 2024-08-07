function executarFormula(formula) {
  const resultadosCorrentes = []
  for (const i in formula) {
    const valorAnterior = isNaN(Number(formula[+i - 1]))
      ? formula[+i - 1]
      : Number(formula[+i - 1])

    const proximoValor = isNaN(Number(formula[+i + 1]))
      ? formula[+i + 1]
      : Number(formula[+i + 1])

    const valorAtual = isNaN(Number(formula[+i]))
      ? formula[+i]
      : Number(formula[+i])

    const tipoValorAtual = typeof valorAtual
    const tipoValorAnterior = typeof valorAnterior

    switch (tipoValorAtual) {
      case "number":
        if (
          (["+", "-", undefined].includes(proximoValor) &&
            ["+", "-", undefined].includes(valorAnterior)) ||
          (tipoValorAnterior === "string" &&
            valorAnterior !== "d" &&
            proximoValor !== "d")

          // 3d20K1 é um exemplo de bug. 1 deveria aparecer depois do K.
        ) {
          resultadosCorrentes.push(valorAtual)
        }
        break
      case "string":
        switch (valorAtual) {
          case "d":
            let tipoDado = dados[proximoValor]

            resultadosCorrentes.push(
              rolarDados(
                valorAnterior,
                tipoDado ? tipoDado : dado(proximoValor)
              )
            )
            break

          case "F":
            break

          default:
            resultadosCorrentes.push(valorAtual)
            break
        }
        break
    }
  }
  console.log(...resultadosCorrentes, formula)
}

//* Explodir o dado não funciona sem sufixo.

// Será util no futuro
//
// case "K":
//  const quantidade = 1
// if (typeof proximoValor === "number") {
//      quantidade = proximoValor
//   }
//     resultadosCorrentes[resultadosCorrentes.length - 1] = keep(
//       resultadosCorrentes,
//       quantidade,
//     )
//
//

function revisarFormula() {
  const formulaRevisada = [...formula]
  for (let i in formulaRevisada) {
    if (["!", "!!"].includes(formulaRevisada[i])) {
      const valorAnterior = isNaN(Number(formulaRevisada[+i - 1]))
        ? 1
        : Number(formulaRevisada[+i - 1])

      formulaRevisada.splice(i + 1, 0, valorAnterior)

      //adicionar o valor da esquerda do sinal à direita.
    }
  }
  return formulaRevisada
}
