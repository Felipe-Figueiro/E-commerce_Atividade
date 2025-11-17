fetch("https://dummyjson.com/products?limit=0")
    .then(res => res.json())
    .then(data => {
        const produtos = data.products;
        const container = document.getElementById("produto-card");

        /**STRIG PARA GUARDAR OS CARDS */
        let cardsHTML = "";

        /** LOOP QUE MONTA OS CARDS */
        for (let i = 0; i < produtos.length; i++) {

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
const carrinhomodal = document.getElementById("dropdown")

function fecharModal() {
    modal.style.display = "none"
}
function abrirModal() {
    modal.style.display = "flex"
}
function abrirModalCarrinho() {
    carrinhomodal.style.display = "block"
}
function fecharCarrinhoModal() {
    carrinhomodal.style.display = "none"
}
btnFecharCarrinho.addEventListener("click", fecharCarrinhoModal);
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

        carregarItensCarrinho();
        alert(`"${tituloProduto}" (R$ ${precoProduto.toFixed(2)}) foi adicionado ao carrinho!`);

        abrirModalCarrinho()
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

// PÁGINA DO CARRINHO CARRINHO
document.addEventListener('DOMContentLoaded', () => {

    const listaCarrinho = document.getElementById('lista-carrinho');
    const valorTotalElemento = document.getElementById('valor-total');
    let carrinho = []
    if (!listaCarrinho || !valorTotalElemento) {
        return;
    }

    function carregarItensCarrinho() {
        listaCarrinho.innerHTML = "";
        //consultar carrinho no localstorage
        const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
            calcularSomaTotal(carrinho); // Você pode querer tirar essa linha e deixar só a de baixo
            return;
        }

        //monta os cards igual do html principal
        carrinho.forEach(item => {
            const itemHTML = `
                <div class="item-carrinho" data-nome="${item.nome}">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="info-item">
                        <h2>${item.nome}</h2>
                        <p>Preço: R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <div class="controle-quantidade">
                        <button class="btn-qtde" data-acao="subtrair">-</button>
                        <span>${item.quantidade}</span>
                        <button class="btn-qtde" data-acao="somar">+</button>
                    </div>
                    <button class="btn-remover">Remover</button>
                </div>
            `;
            listaCarrinho.innerHTML += itemHTML;
        });

        // // adicionarEventos(); 

        calcularSomaTotal(carrinho);
    }
    // CALCULAR VALORES POR QUANTIDADE
    function calcularSomaTotal(carrinho) {
        const total = carrinho.reduce((soma, item) => {
            return soma + (item.preco * item.quantidade);
        }, 0);

        valorTotalElemento.textContent = `R$ ${total.toFixed(2)}`;
    }

    function adicionarEventos() {
        listaCarrinho.addEventListener('click', (evento) => {
            const target = evento.target;
            const itemElemento = target.closest('.item-carrinho');
            if (!itemElemento) return;

            const nomeItem = itemElemento.dataset.nome;

            if (target.classList.contains('btn-remover')) {
                atualizarItem(nomeItem, 0); // 0 significa remover
            }
            if (target.classList.contains('btn-qtde')) {
                const acao = target.dataset.acao;
                if (acao === 'somar') {
                    atualizarItem(nomeItem, 1); // 1 significa somar
                } else if (acao === 'subtrair') {
                    atualizarItem(nomeItem, -1); // -1 significa subtrair
                }
            }
        });
    }

    // Função central para ATUALIZAR (somar, subtrair ou remover)
    function atualizarItem(nome, mudancaQuantidade) {
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        const itemIndex = carrinho.findIndex(item => item.nome === nome);

        if (itemIndex === -1) return;

        if (mudancaQuantidade === 0) { // Remover
            carrinho.splice(itemIndex, 1);
        } else { // Somar ou Subtrair
            carrinho[itemIndex].quantidade += mudancaQuantidade;
            if (carrinho[itemIndex].quantidade <= 0) {
                // Garante que se a quantidade for 0 ou menos, o item é removido
                carrinho.splice(itemIndex, 1);
            }
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        // Recarregar os itens é a ação correta, pois redesenha a tela
        carregarItensCarrinho();
    }

    // --- Carrega tudo quando a página abre ---

    // // Isso adiciona o "escutador" ao container principal
    adicionarEventos();

    // Isso carrega os itens pela primeira vez
    carregarItensCarrinho();
});