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
            let tipoDado = dados.hasOwnProperty(proximoValor)
              ? [...dados[proximoValor]]
              : false

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
            const rolagensR =
              resultadosCorrentes[resultadosCorrentes.length - 1]
            const facesR = proximoValor
            const sinalR = valorAtual

            const éComparadorR = ["≥", "≤"].includes(formula[+i + 2])

            const comparadoR = éComparadorR ? formula[+i + 3] : formula[+i + 2]

            const condicaoR = éComparadorR ? formula[+i + 2] : 0

            resultadosCorrentes[resultadosCorrentes.length - 1] = Reroll(
              rolagensR,
              facesR,
              comparadoR,
              sinalR,
              condicaoR
            )

            break

          case "!":
          case "!!":
            const rolagensE =
              resultadosCorrentes[resultadosCorrentes.length - 1]
            const sinalE = valorAtual == "!" ? "R" : "r"

            resultadosCorrentes[resultadosCorrentes.length - 1] = Reroll(
              rolagensE,
              proximoValor,
              proximoValor,
              sinalE,
              ""
            )
            break

          case "≥":
          case "≤":
            const rolagens = resultadosCorrentes[resultadosCorrentes.length - 1]
            const comparador = valorAtual
            const comparado = proximoValor

            resultadosCorrentes[resultadosCorrentes.length - 1] = comparar(
              rolagens,
              comparador,
              comparado
            )
            break

          default:
            resultadosCorrentes.push(valorAtual)
            break
        }
        break
    }
  }

  return resultadosCorrentes
}

// Revisa formula e adiciona valores após sinais para simplificar a execução da formula

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
    if (typeof valorAtual === "number")
      formulaRevisada.splice(i, 1, +valorAtual)

    if (valorAtual === "%") formulaRevisada.splice(i, 1, 100)

    if (["!", "!!"].includes(valorAtual) && !+proximoValor) {
      const facesUltimoDado = !+valorAnterior ? 1 : +formulaRevisada[+i - 1]

      formulaRevisada.splice(+i + 1, 0, facesUltimoDado)
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

  return formulaRevisada
}

function calcular(formula) {
  for (let i in formula) {
    if (["object", "number"].includes(typeof formula[i])) {
      formula.splice(i, 1, somar(formula[i]))
    }
  }

  let soma = +formula[0]

  for (let i in formula) {
    const proximoValor = formula[+i + 1]
    const valorAnterior = formula[i - 1]
    const valorAtual = formula[i]

    if (valorAtual === "+") {
      soma += +proximoValor
    } else if (valorAnterior === "-") {
      soma -= +proximoValor
    }
  }
  return soma ? soma : 0
}
