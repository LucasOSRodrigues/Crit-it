const tela = document.querySelector(".tela")
const botaoRolar = document.querySelector(".rolar")

const botoes = document.querySelectorAll("button")

let ultimoTipoPressionado = ""
let formula = []

botoes.forEach((botao) =>
  botao.addEventListener("click", (event) => {
    switch (event.target.className) {
      case "dado":
        const numeroDeFaces = event.target.innerText.slice(1)

        switch (ultimoTipoPressionado) {
          case "dado":
          case "N":
          case "sufixo":
            const tamanhoFormula = formula.length
            if (
              // Evitar bugs se o sufixo for igual ao numero de faces
              ultimoTipoPressionado != "sufixo" &&
              // Caso o mesmo dado seja pressionado 2 vezes ou mais.
              formula[tamanhoFormula - 1] === numeroDeFaces
            ) {
              // acrescer 1 no prefixo de quantidade de dados rolados.
              const numeroDeFacesAcrescido = +formula[tamanhoFormula - 3] + 1
              formula[tamanhoFormula - 3] = numeroDeFacesAcrescido
            } else {
              //Caso dados diferentes forem pressionados, por "+" entre os dois.
              formula.push("+", 1, "d")
              if (numeroDeFaces === "N") {
                ultimoTipoPressionado = "dN"
              } else {
                formula.push(numeroDeFaces)
                ultimoTipoPressionado = "dado"
              }
            }
            break

          case "sinal":
            if (!["+", "-"].includes(formula.at(-1))) formula.push("+")
          case "":
            //Adicionar 1 na formula para ser o prefixo do próximo dado.
            formula.push(1)

          case "numero":
            formula.push("d")
            if (numeroDeFaces === "N") {
              ultimoTipoPressionado = "dN"
            } else {
              formula.push(numeroDeFaces)
              ultimoTipoPressionado = "dado"
            }
            break
        }
        break

      case "sinal":
        switch (ultimoTipoPressionado) {
          case "dado":
          case "N":
            formula.push(event.target.innerText)
            ultimoTipoPressionado = "sinal"
            break
          case "numero":
          case "sufixo":
            if (
              event.target.innerText === "+" ||
              event.target.innerText === "-"
            ) {
              formula.push(event.target.innerText)
              ultimoTipoPressionado = "sinal"
            }
            break
          case "sinal":
            // > e < pode vir depois de R ou r
            if (
              ["r", "R"].includes(formula[formula.length - 1]) &&
              ["≥", "≤"].includes(event.target.innerText)
            )
              formula.push(event.target.innerText)

            // + e - pode vir depois de Sinal
            if (
              ["+", "-"].includes(event.target.innerText) &&
              !["+", "-", "≥", "≤"].includes(formula.at(-1))
            )
              formula.push(event.target.innerText)

            break
        }
        break

      case "numero":
        switch (ultimoTipoPressionado) {
          case "dado":
            formula.push("+", event.target.innerText)
            ultimoTipoPressionado = "numero"
            break
          case "sufixo":
          case "numero":
          case "N":
            // Concatena o atual digito númerico no numero anterior.
            formula[formula.length - 1] += event.target.innerText
            break
          case "sinal":
            if (["!", "!!"].includes(formula.at(-1))) break

            formula.push(event.target.innerText)
            ultimoTipoPressionado = "sufixo"
            break
          // Sufixo é todo numero que vem depois de um sinal

          default:
            formula.push(event.target.innerText)
            ultimoTipoPressionado =
              ultimoTipoPressionado === "dN" ? "N" : "numero"
            break
        }
        break

      case "apagar":
        tela.innerText = ultimoTipoPressionado = ""
        formula = []
        break

      case "rolar":
        if (!["d", "-", "+"].includes(formula.at(-1))) {
          const revisado = revisarFormula()
          const rolagens = executarFormula(revisado)
          const resultado = calcular([...rolagens])

          console.log(resultado, ...rolagens)
        }
        break
    }
    tela.innerText = formula.join("")
  })
)

//* mudar cor dos botões de sinal caso o valor anterior seja um número // Não tem funcionalidade.
//* Apertar um sinal 2 vezes ou mais para multiplicá-lo
