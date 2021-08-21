function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Faz parte do requisito 1
function adicionarProduto(produtos) {
  const sessionClassItems = document.querySelector('.items');
  sessionClassItems.innerHTML = '';
  produtos.forEach((produto) => {
    const { id: sku, title: name, thumbnail: image } = produto;
    const produtoMercadoLivre = createProductItemElement({ sku, name, image });
    sessionClassItems.appendChild(produtoMercadoLivre);
  });
}

// Faz parte do requisito 1
// Criando uma lista de produtos consultando API do Mercado Livre.
function criacaoPesquisaProdutos() {
  const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(apiMercadoLivre)
    .then((response) => response.json())
    .then((ObjetoProduto) => (adicionarProduto(ObjetoProduto.results)))
    .catch((error) => console.log(error));
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(/* event */) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = function onload() {
  criacaoPesquisaProdutos();
  // getSkuFromProductItem();
  // createCartItemElement();
};
