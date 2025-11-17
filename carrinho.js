// PÁGINA DO CARRINHO CARRINHO
document.addEventListener('DOMContentLoaded', () => {

    const listaCarrinho = document.getElementById('lista-carrinho');
    const valorTotalElemento = document.getElementById('valor-total');

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