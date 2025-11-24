// SELETORES GLOBAIS
const containerDosCards = document.getElementById("produto-card");
const modal = document.getElementById("modal");
const btnFechar = document.getElementById("btn-fechar");
const carrinhoDropdown = document.getElementById("dropdown"); // Renomeado para 'carrinhoDropdown' para clareza
const listaCarrinho = document.getElementById('lista-carrinho');
const valorTotalElemento = document.getElementById('valor-total');

// --- FUNÇÕES DE CONTROLE DE MODAL ---

function fecharModal() {
    modal.style.display = "none";
}
function abrirModal() {
    modal.style.display = "flex";
}
function abrirModalCarrinho() {
    carrinhoDropdown.style.display = "flex";
}
function fecharCarrinhoModal() {
    carrinhoDropdown.style.display = "none";
}

// CORRIGIDO: Certifique-se de que este botão existe no seu HTML com o ID "btn-fechar-carrinho"
const btnFecharCarrinho = document.getElementById("btnFecharCarrinho"); 
if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener("click", fecharCarrinhoModal);
}
const finalizar = document.getElementById("carrin")
if (finalizar) {
    finalizar.addEventListener("click", abrirModalCarrinho);
}
// --- FUNÇÕES DE LÓGICA DO CARRINHO (EXTRAÍDAS) ---

function calcularSomaTotal(carrinho) {
    const total = carrinho.reduce((soma, item) => {
        return soma + (item.preco * item.quantidade);
    }, 0);

    if (valorTotalElemento) {
        valorTotalElemento.textContent = `R$ ${total.toFixed(2)}`;
    }
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


/**
 * FUNÇÃO CRÍTICA EXTRAÍDA
 * Carrega e exibe os itens do LocalStorage no modal do carrinho.
 */
function carregarItensCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (!listaCarrinho) return;

    listaCarrinho.innerHTML = ''; // Limpa a lista atual

    carrinho.forEach(item => {
        const itemHTML = `
            <div class="item-carrinho" data-nome="${item.nome}">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 50px;">
                <p>${item.nome}</p>
                <div class="quantidade-controle">
                    <button class="btn-qtde" data-acao="subtrair">-</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-qtde" data-acao="somar">+</button>
                </div>
                <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                <button class="btn-remover">Remover</button>
            </div>
        `;
        listaCarrinho.innerHTML += itemHTML;
    });

    calcularSomaTotal(carrinho);
}


// --- LÓGICA DE FETCH DOS PRODUTOS ---

fetch("https://dummyjson.com/products?limit=0")
    .then(res => res.json())
    .then(data => {
        // ... (Seu código de renderização dos cards permanece aqui)
        const produtos = data.products;
        let cardsHTML = "";

        for (let i = 0; i < produtos.length; i++) {
            const produto = produtos[i];
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
            } else {
                break;
            }
        }
        containerDosCards.innerHTML = cardsHTML;
    })
    .catch(error => {
        console.error("erro ao carregar produto", error);
        containerDosCards.innerHTML = "<p>erro ao carregar produto</p>";
    });

// --- LÓGICA DE EVENTOS PRINCIPAIS ---

containerDosCards.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-comprar")) {
        abrirModal();
    }
    
    if (evento.target.classList.contains("btn-carrinho")) {
        const cardClicado = evento.target.closest(".card");
        const tituloProduto = cardClicado.querySelector("h2").textContent;
        const precoProduto = parseFloat(cardClicado.querySelector("R$"+".price a").textContent);
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

        alert(`"${tituloProduto}" (R$ ${precoProduto.toFixed(2)}) foi adicionado ao carrinho!`);

        carregarItensCarrinho(); 

        abrirModalCarrinho(); 
    }
});

// fechar modal comprar
btnFechar.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    if (evento.target.id === "modal") {
        fecharModal();
    }
});


// PÁGINA DO CARRINHO - Eventos de alteração de quantidade/remoção
document.addEventListener('DOMContentLoaded', () => {

    // Função para adicionar eventos de clique no carrinho (apenas uma vez)
    if (listaCarrinho) {
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

    // Carrega os itens do carrinho quando a página é carregada
    carregarItensCarrinho();
});