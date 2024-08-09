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
        if (["+", "-"].includes(valorAnterior) && proximoValor !== "d") {
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
            // R = reroll rerrola quaisquer valores igual á 1 ou igual ao sufixo ou
            // se o sufixo for > ou <, rerrolar todos os valores que satisfaz a condição,
            // Acontece até a condição ser falsa.

            // r = funciona como o R, mas ele rerrola somente 1 única vez.

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
