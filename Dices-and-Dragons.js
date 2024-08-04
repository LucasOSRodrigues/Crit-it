const tela = document.querySelector(".tela")
const botaoRolar = document.querySelector(".rolar")

const botoes = document.querySelectorAll("button")

botoes.forEach((botao) =>
  botao.addEventListener("click", (event) => {
    tela.innerHTML = event.target.innerHTML
  })
)
