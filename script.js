// requisito 6
// Está removendo todos os itens do Produto no carrinho de compras.
function esvaziarCarrinhoDeCompra() {
  const botaoEsvaziarCarrinhoClass = document.querySelector('.empty-cart');
  botaoEsvaziarCarrinhoClass.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    localStorage.clear();
  });
}

// requisito 4
// Está sendo salvo no localStore ao colocar e remover o produto do carrinho de compras.
function salvarNoLocalStorage() {
  const ol = document.querySelector('ol');
  localStorage.setItem('KeyitemProduto', ol.innerHTML);
}

// Requesito 3
// Removendo um produto do carrinho de compra ao clicar nele.
function cartItemClickListener(event) {
  const removerProdutoClicadoli = event.target;
  const ol = document.querySelector('ol');
  ol.removeChild(removerProdutoClicadoli);
  salvarNoLocalStorage();
}

// Faz parte do requisito 4
function capturarLocalStoreValue() {
  const ol = document.querySelector('ol');
  const capturarLocalStoreProduto = localStorage.getItem('KeyitemProduto');
  ol.innerHTML = capturarLocalStoreProduto;
  const ListaProdutoli = document.querySelectorAll('li');
  ListaProdutoli.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

// Faz parte do requisito 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Faz parte do requisito 2
function adicionarNoCarrinho(li) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  salvarNoLocalStorage();
}

// requisito 2
// Adicionando o Produto no Carrinho de Compra com o valor do seu id selecionado para cada produto.
function clicarNoProdutoAdicionarCarrinho(idProduto) {
  try {
    const URLProdutoId = `https://api.mercadolibre.com/items/${idProduto}`;
    fetch(URLProdutoId)
      .then((response) => response.json())
      .then((ObjetoProdutoAPI) => {
        const objetoProdutoId = createCartItemElement(ObjetoProdutoAPI);
        adicionarNoCarrinho(objetoProdutoId);
      });
  } catch (error) {
    console.log(error);
  }
}

// Faz parte do requisito 2
function adicionarNoButtonIdProduto() {
  const buttonAdicionar = document.querySelectorAll('.item__add');
  buttonAdicionar.forEach((buttonProduto) => {
    buttonProduto.addEventListener('click', () => {
      const produtoId = buttonProduto.parentNode.firstChild.innerText;

      clicarNoProdutoAdicionarCarrinho(produtoId);
    });
  });
}

// faz parte do requisito 1
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Faz parte do requisito 1
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// faz parte do requisito 1
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// faz parte do requisito 1
function adicionarProduto(produtos) {
  const sessionClassItems = document.querySelector('.items');
  sessionClassItems.innerHTML = '';
  produtos.forEach((produto) => {
    const { id: sku, title: name, thumbnail: image } = produto;
    const produtoMercadoLivre = createProductItemElement({ sku, name, image });
    sessionClassItems.appendChild(produtoMercadoLivre);
  });

  adicionarNoButtonIdProduto();
}

// requisito 1
// Criando uma lista de produtos consultando API do Mercado Livre.
function criacaoPesquisaProdutos() {
  const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(apiMercadoLivre)
    .then((response) => response.json())
    .then((ObjetoProduto) => (adicionarProduto(ObjetoProduto.results)))
    .catch((error) => console.log(error));
}

window.onload = function onload() {
  criacaoPesquisaProdutos();
  esvaziarCarrinhoDeCompra();
  capturarLocalStoreValue();
};
