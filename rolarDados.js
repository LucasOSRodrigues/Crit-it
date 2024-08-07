function executarFormula(formula) {
  const resultadosCorrentes = []
  for (const i in formula) {
    const valorAnterior = !Number(formula[+i - 1])
      ? formula[+i - 1]
      : Number(formula[+i - 1])

    const proximoValor = !Number(formula[+i + 1])
      ? formula[+i + 1]
      : Number(formula[+i + 1])

    const valorAtual = !Number(formula[+i]) ? formula[+i] : Number(formula[+i])

    switch (typeof valorAtual) {
      case "number":
        if (valorAnterior !== "d" && proximoValor !== "d") {
          resultadosCorrentes.push(valorAtual)
        }
        break
      case "string":
        switch (valorAtual) {
          case "d":
            let tipoDado = [...dados[proximoValor]]

            resultadosCorrentes.push(
              rolarDados(
                valorAnterior,
                tipoDado ? tipoDado : dado(proximoValor)
              )
            )
            break

          case "F":
            break
          case "K":
            const quantidade = +proximoValor

            // resultadosCorrentes[resultadosCorrentes.length - 1] = keep(
            //   resultadosCorrentes,
            //   quantidade
            // )

            resultadosCorrentes.push(keep(resultadosCorrentes, quantidade))

            break

          default:
            resultadosCorrentes.push(valorAtual)
            break
        }
        break
    }
  }
  console.log(...resultadosCorrentes)
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
    if (
      ["!", "!!"].includes(formulaRevisada[+i]) &&
      !Number(formulaRevisada[+i + 1])
    ) {
      const valorAnterior = !Number(formulaRevisada[+i - 1])
        ? 1
        : Number(formulaRevisada[+i - 1])

      formulaRevisada.splice(+i + 1, 0, valorAnterior)
      // e se ! tiver sufixo?
      //adicionar o valor da esquerda do sinal à direita.
    }
    if (
      ["K", "k", "X", "x", "R", "r"].includes(formulaRevisada[+i]) &&
      !Number(formulaRevisada[+i + 1])
    ) {
      formulaRevisada.splice(+i + 1, 0, 1)
    }
  }
  return formulaRevisada
}
