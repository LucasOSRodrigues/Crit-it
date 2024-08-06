const tela = document.querySelector(".tela")
const botaoRolar = document.querySelector(".rolar")

const botoes = document.querySelectorAll("button")

let ultimoTipoPressionado = ""
let sequenciaDeOperacoes = []

botoes.forEach((botao) =>
  botao.addEventListener("click", (event) => {
    //! LEMBRAR DE TIRAR O CONSOLE.LOG!!
    // console.log(event.target.className, event.target.innerText)

    switch (event.target.className) {
      case "dado":
        const numeroDeFaces = event.target.innerText.slice(1)

        switch (ultimoTipoPressionado) {
          case "dado":
          case "N":
            const tamanhoDaSequencia = sequenciaDeOperacoes.length
            if (
              // Caso o mesmo dado seja pressionado 2 vezes ou mais.
              sequenciaDeOperacoes[tamanhoDaSequencia - 1] === numeroDeFaces
            ) {
              let quantidadeDeDados = Number(
                sequenciaDeOperacoes[tamanhoDaSequencia - 3]
              )
              // Se não houver prefixo de quantidade de dados rolados (rolar somente 1 dado),
              if (!quantidadeDeDados) {
                // criar prefixo com valor 2.
                sequenciaDeOperacoes.splice(tamanhoDaSequencia - 2, 0, 2)
              } else {
                // Senão acrescer 1 no prefixo de quantidade de dados rolados.
                const numeroDeFacesAcrescido =
                  +sequenciaDeOperacoes[tamanhoDaSequencia - 3] + 1
                sequenciaDeOperacoes[tamanhoDaSequencia - 3] =
                  numeroDeFacesAcrescido
              }
            } else {
              //Caso dados diferentes forem pressionados, por "+" entre os dois.
              sequenciaDeOperacoes.push("+", "d")
              if (numeroDeFaces === "N") {
                ultimoTipoPressionado = "dN"
              } else {
                sequenciaDeOperacoes.push(numeroDeFaces)
                ultimoTipoPressionado = "dado"
              }
            }
            break

          case "numero":
          case "":
            sequenciaDeOperacoes.push("d")
            if (numeroDeFaces === "N") {
              ultimoTipoPressionado = "dN"
            } else {
              sequenciaDeOperacoes.push(numeroDeFaces)
              ultimoTipoPressionado = "dado"
            }
            break
        }
        break

      case "sinal":
        switch (ultimoTipoPressionado) {
          //Talvez da para por o "ultimoTipoPressionado = sinal" depois do switch

          case "dado":
          case "N":
            sequenciaDeOperacoes.push(event.target.innerText)
            ultimoTipoPressionado = "sinal"
            break
          case "numero":
            if (
              event.target.innerText === "+" ||
              event.target.innerText === "-"
            ) {
              sequenciaDeOperacoes.push(event.target.innerText)
            }
            ultimoTipoPressionado = "sinal"
            break
        }
        break

      case "numero":
        switch (ultimoTipoPressionado) {
          case "dado":
            sequenciaDeOperacoes.push("+", event.target.innerText)
            ultimoTipoPressionado = "numero"
            break
          case "numero":
          case "N":
            // Concatena o atual digito númerico no numero anterior.
            sequenciaDeOperacoes[sequenciaDeOperacoes.length - 1] +=
              event.target.innerText
            break
          default:
            sequenciaDeOperacoes.push(event.target.innerText)
            ultimoTipoPressionado =
              ultimoTipoPressionado === "dN" ? "N" : "numero"
            break
        }
        break

      case "apagar":
        tela.innerText = ultimoTipoPressionado = ""
        sequenciaDeOperacoes = []
        break

      case "rolar":
        executarFormula()
        break

      default:
        tela.innerText = "DEU MERDA!!!"
        break
    }
    tela.innerText = sequenciaDeOperacoes.join("")
  })
)
//* mudar cor dos botões de sinal caso o valor anterior seja um número // Não tem funcionalidade.
