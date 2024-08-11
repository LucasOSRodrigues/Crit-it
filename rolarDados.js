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
            const valor = formula[+i + 2]
            const sinal = valorAtual
            const condicao = formula[+i + 3]

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

function revisarFormula() {
  const formulaRevisada = [...formula]
  for (let i = 0; i < formulaRevisada.length; i++) {
    if (
      ["!", "!!"].includes(formulaRevisada[+i]) &&
      !Number(formulaRevisada[+i + 1])
    ) {
      const valorAnterior = !Number(formulaRevisada[+i - 1])
        ? 1
        : Number(formulaRevisada[+i - 1])

      formulaRevisada.splice(+i + 1, 0, valorAnterior)
    }
    if (
      ["K", "k", "X", "x", "R", "r"].includes(formulaRevisada[+i]) &&
      !Number(formulaRevisada[+i + 1])
    ) {
      formulaRevisada.splice(+i + 1, 0, 1)

      if (["r", "R"].includes(formulaRevisada[i]))
        formulaRevisada.splice(+i + 1, 0, formulaRevisada[+i - 1])
    }
  }
  return formulaRevisada
}
