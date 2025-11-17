fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        const produtos = data.products;
        const container = document.getElementById("produto-card");

        /**STRIG PARA GUARDAR OS CARDS */
        let cardsHTML = "";

        /** LOOP QUE MONTA OS CARDS */
        for (let i = 0; i < 30; i++) {

            const produto = produtos[i];
            /**condição para verificar se há item na API */
            if (produto) {
                cardsHTML += `
                <div class="card"> 
                    <img src= "${produto.thumbnail}" alt="${produto.title}"></img>
                    <h2>${produto.title}</h2>
                    <p>${produto.description}</p>
                    <div class="price">Preço: R$<a>${produto.price}</a></div>
                    <div class="rating">Avaliações: ${produto.rating} ⭐</div> 
                    <button class="btn-carrinho">Adicionar ao carrinho</button>
                    <button class="btn-comprar">Comprar</button>
                </div>
                `
            }

            else {
                break;
            }
        }
        container.innerHTML = cardsHTML;
    })
    .catch(error => {
        console.error("erro ao carregar prodto", error);
        document.getElementById("produto-card").innerHTML = "<p>erro ao carregar produto</p>";
    });

/****************************MODAL *****************MODAL ****************/
const containerDosCards = document.getElementById("produto-card");
const modal = document.getElementById("modal");
const btnFechar = document.getElementById("btn-fechar");

function fecharModal() {
    modal.style.display = "none"
}
function abrirModal() {
    modal.style.display = "flex"
}

// CÓDIGO DOS BOTÕES PARA DO MENU PARA JOGAREM AO CARRINHO E CRIAÇÃO DO LOCALSTORAGE
containerDosCards.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-comprar")) {
        abrirModal();
    }
    if (evento.target.classList.contains("btn-carrinho")) {
        const cardClicado = evento.target.closest(".card");
        const tituloProduto = cardClicado.querySelector("h2").textContent;
        const precoProduto = parseFloat(cardClicado.querySelector(".price a").textContent);
        const imgProduto = cardClicado.querySelector("img").src;

        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        const itemExistente = carrinho.find(item => item.nome === tituloProduto);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            const produtoAdicionado = {
                nome: tituloProduto,
                preco: precoProduto,
                imagem: imgProduto,
                quantidade: 1
            };
            carrinho.push(produtoAdicionado);
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        console.log("Carrinho atual:", carrinho);
        alert(`"${tituloProduto}" de R$${precoProduto} foi adicionado ao carrinho!`);
    }
});

/** fechar modal comprar*/
btnFechar.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    /** Só fecha se o clique for NO FUNDO (id="modal")
         e não no conteúdo (class="contmodal")*/
    if (evento.target.id === "modal") {
        fecharModal();
    }
});

/**
/// API PARA GRAFICOS DE DADOS não consegui rodar no js, somente no html.
async function carregadados() {
    //faz uma requisição a api
    const resposta = await fetch("https://dummyjson.com/products");
    // converte os dados de texto para obj
    const dados = await resposta.json();
    //pega o titulo em array(map) e nomeia para nomes
    const nome = dados.products.map(p => p.title);
    //pega as avaliações também em array e nomeia como aval
    const aval = dados.products.map(p => p.rating);
    //

    //monta o gráfico
    new Chart(document.getElementById("grafico"), {
        type: 'bar',
        //geração dos itens dos graficos
        data: {
            labels: nome,
            datasets: [{
                label: "produtos e avalaiações",
                data: aval,
                backgroundcolor: "rgba(54,162,235, 0.6)",
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}
// carregadados();
*/