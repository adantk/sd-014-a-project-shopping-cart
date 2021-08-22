function cartItemClickListener(/* event */) {
  // coloque seu código aqui
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
};
