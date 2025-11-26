// SELETORES GLOBAIS
const listaCarrinho = document.getElementById('lista-carrinho');
const valorTotalElemento = document.getElementById('valor-total');

// Seletores específicos da página de produtos (index.html)
const containerDosCards = document.getElementById("produto-card");
const modal = document.getElementById("modal");
const btnFechar = document.getElementById("btn-fechar");
const carrinhoDropdown = document.getElementById("dropdown");
const btnFecharCarrinho = document.getElementById("btnFecharCarrinho");
const finalizar = document.getElementById("carrin");


// --- FUNÇÕES DE CONTROLE DE MODAL (Só serão usadas se os seletores existirem) ---

function fecharModal() {
    if (modal) modal.style.display = "none";
}
function abrirModal() {
    if (modal) modal.style.display = "flex";
}
function abrirModalCarrinho() {
    if (carrinhoDropdown) carrinhoDropdown.style.display = "flex";
}
function fecharCarrinhoModal() {
    if (carrinhoDropdown) carrinhoDropdown.style.display = "none";
}


if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener("click", fecharCarrinhoModal);
}
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

function atualizarItem(nome, mudancaQuantidade) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const itemIndex = carrinho.findIndex(item => item.nome === nome);

    if (itemIndex === -1) return;

    if (mudancaQuantidade === 0) {
        carrinho.splice(itemIndex, 1);
    } else {
        carrinho[itemIndex].quantidade += mudancaQuantidade;
        if (carrinho[itemIndex].quantidade <= 0) {
            carrinho.splice(itemIndex, 1);
        }
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarItensCarrinho();
}

function carregarItensCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (!listaCarrinho) return;

    listaCarrinho.innerHTML = '';

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<p style="text-align: center; margin-top: 20px;">Seu carrinho está vazio!</p>';
        calcularSomaTotal(carrinho); // Garante que o total seja R$ 0,00
        return;
    }

    carrinho.forEach(item => {
        const itemHTML = `
            <div class="item-carrinho" data-nome="${item.nome}">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: 50px;">
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


// --- LÓGICA DE FETCH DOS PRODUTOS (SÓ RODA SE O CONTAINER EXISTIR) ---

if (containerDosCards) {
    fetch("https://dummyjson.com/products?limit=0")
        .then(res => res.json())
        .then(data => {
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
            containerDosCards.innerHTML = "<p>erro ao carregar produto</p>";
        });

    // --- LÓGICA DE EVENTOS PRINCIPAIS (SÓ RODA SE O CONTAINER EXISTIR) ---
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

            alert(`"${tituloProduto}" (R$ ${precoProduto.toFixed(2)}) foi adicionado ao carrinho!`);

            carregarItensCarrinho();
            abrirModalCarrinho();
        }
    });

    if (btnFechar) btnFechar.addEventListener("click", fecharModal);

    if (modal) {
        modal.addEventListener("click", function (evento) {
            if (evento.target.id === "modal") {
                fecharModal();
            }
        });
    }
}


// PÁGINA DO CARRINHO - Eventos de alteração de quantidade/remoção (sempre roda)
document.addEventListener('DOMContentLoaded', () => {

    if (listaCarrinho) {
        listaCarrinho.addEventListener('click', (evento) => {
            const target = evento.target;
            const itemElemento = target.closest('.item-carrinho');
            if (!itemElemento) return;

            const nomeItem = itemElemento.dataset.nome;

            if (target.classList.contains('btn-remover')) {
                atualizarItem(nomeItem, 0);
            }
            if (target.classList.contains('btn-qtde')) {
                const acao = target.dataset.acao;
                if (acao === 'somar') {
                    atualizarItem(nomeItem, 1);
                } else if (acao === 'subtrair') {
                    atualizarItem(nomeItem, -1);
                }
            }
        });
        // Esta chamada garante que o carrinho é exibido tanto no index (dropdown) quanto no carrinho.html
        carregarItensCarrinho();
    }
});