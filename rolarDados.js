function executarFormula(formula) {
  const resultadosCorrentes = []

  for (const i in formula) {
    const valorAnterior = !+formula[i - 1] ? formula[i - 1] : +formula[i - 1]

    const proximoValor = !+formula[+i + 1] ? formula[+i + 1] : +formula[+i + 1]

    const valorAtual = !+formula[i] ? formula[i] : +formula[i]

    switch (typeof valorAtual) {
      case "number":
        if (
          ["+", "-", undefined].includes(valorAnterior) &&
          proximoValor !== "d"
        ) {
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
          case "k":
            resultadosCorrentes[resultadosCorrentes.length - 1] = keep(
              resultadosCorrentes,
              +proximoValor,
              valorAtual === "K" ? 1 : 0
            )
            break

          case "X":
          case "x":
            const ultimaRolagem =
              resultadosCorrentes[resultadosCorrentes.length - 1]
            const tamanhoUltimaRolagem = ultimaRolagem.length

            resultadosCorrentes[resultadosCorrentes.length - 1] = keep(
              resultadosCorrentes,
              tamanhoUltimaRolagem - +proximoValor,
              valorAtual === "x" ? 1 : 0
            )
            break

          case "R":
          case "r":
            const rolagens = resultadosCorrentes[resultadosCorrentes.length - 1]
            const faces = proximoValor
            const sinal = valorAtual

            const éComparador = ["≥", "≤"].includes(formula[+i + 2])

            const valor = éComparador ? formula[+i + 3] : formula[+i + 2]

            const condicao = éComparador ? formula[+i + 2] : 0

            resultadosCorrentes[resultadosCorrentes.length - 1] = Reroll(
              rolagens,
              faces,
              valor,
              sinal,
              condicao
            )

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

// Revisa formula e adiciona valores após sinais para simplificar a execução da formular

function revisarFormula() {
  const formulaRevisada = [...formula]
  for (let i = 0; i < formulaRevisada.length; i++) {
    const proximoValor = formulaRevisada[+i + 1]
    const valorAnterior = formulaRevisada[i - 1]
    const valorAtual = formulaRevisada[i]
    /*
    Se o valor atual for "!" ou "!!" e o próximo valor não for numerico
    Adicionar o valor anterior (faces do ultimo dado rolado) na frente do atual.

    Isso serve para o código saber qual dado ele deve rolar caso exploda.
    */
    if (["!", "!!"].includes(valorAtual) && !+proximoValor) {
      const valorAnterior = !+valorAnterior ? 1 : +formulaRevisada[+i - 1]

      formulaRevisada.splice(+i + 1, 0, valorAnterior)
    }

    /* Se o valor atual for "K", "k", "X", "x", "≥" ou "≤"
     e o próximo valor não for numerico: Adicionar 1 na frente
     */
    if (["K", "k", "X", "x", "≥", "≤"].includes(valorAtual) && !+proximoValor) {
      formulaRevisada.splice(+i + 1, 0, 1)
    }

    /*
     Se o valor atual for "R" ou "r"
        Adicionar o valor anterior (faces do ultimo dado) à frente.
      se proximo valor não for numerico e nem comparador:
        Adicionar 1 à frente.
     */
    if (["r", "R"].includes(valorAtual)) {
      if (!["≥", "≤"].includes(proximoValor) && !+proximoValor) {
        formulaRevisada.splice(+i + 1, 0, 1)
      }

      formulaRevisada.splice(+i + 1, 0, +valorAnterior)
    } // formula: ("R" ou "r"), valor, faces
  }
  console.log(formulaRevisada)

  return formulaRevisada
}
