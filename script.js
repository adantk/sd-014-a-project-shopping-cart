let listaItens;

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts(QUERY, callback) {
  const products = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const productsJson = await products.json();
  productsJson.results.forEach((item) => listaItens.appendChild(createProductItemElement(item)));
  callback();
}

async function getItem(ItemID) {
  const item = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  return item.json();
}

async function cartItemCreator(event) {
  const itemId = await getSkuFromProductItem(event.target.parentElement);
  const objectItem = await getItem(itemId);
  document.querySelector('.cart__items').appendChild(createCartItemElement(objectItem));
}

function addListeners() {
  document.querySelectorAll('button.item__add')
    .forEach((item) => item.addEventListener('click', cartItemCreator));
}

window.onload = () => {
  getProducts('computador', addListeners);
  listaItens = document.querySelector('.items');
};

/* Requisito 1
  1- Fazer fetch da URL do Mercado Livre
  2- Armazenar o resultado da busca em uma variável
  3- Transformar resultado em JSON
  4- Mostrar a lista de produtos na tela
*/

/* Requisito 2
  1 - Adicionar um Event Listener no botão de 'Adicionar ao carrinho'
  2 - Acessar o ID do item (item__sku) a partir do botão
  3 - Usar a função cartItemCreator para criar a lista de itens no carrinho de compras
    3.1 - Retornar o objeto JSON a partir do ID do item (que é obtido com a função getSkuFromProductItem)
    3.2 - Usar a função createCartItemElement para criar os elementos HTML referentes ao item
*/