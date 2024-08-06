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
              sequenciaDeOperacoes[tamanhoDaSequencia - 1] === numeroDeFaces
            ) {
              let quantidadeDeDados = Number(
                sequenciaDeOperacoes[tamanhoDaSequencia - 3]
              )
              if (!quantidadeDeDados) {
                sequenciaDeOperacoes.splice(tamanhoDaSequencia - 2, 0, 2)
              } else {
                const numeroDeFacesAcrescido =
                  +sequenciaDeOperacoes[tamanhoDaSequencia - 3] + 1
                sequenciaDeOperacoes[tamanhoDaSequencia - 3] =
                  numeroDeFacesAcrescido
              }
            } else {
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

      case "formula":
        switch (ultimoTipoPressionado) {
          case "dado":
          case "N":
            // todo se vira ai pra descobrir oq fazer, boa noite
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
//* mudar cor dos botões de formula caso o valor anterior seja um número // Não tem funcionalidade.
