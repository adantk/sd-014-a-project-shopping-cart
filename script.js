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

function totalPrice() {
  const span = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartItems.forEach((li) => {
    sum += Number(li.innerText.split('$')[1]);
    span.innerHTML = Math.round(sum * 100) / 100;
  });
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts(QUERY, callback) {
  const loading = createCustomElement('span', 'loading', 'loading...');
  document.body.appendChild(loading);
  const products = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const productsJson = await products.json();
  productsJson.results.forEach((item) => listaItens.appendChild(createProductItemElement(item)));
  loading.remove();
  callback();
}

async function getItem(ItemID) {
  const item = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  return item.json();
}

function setLocalStorage() {
  const ol = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('stored', ol.innerHTML);  
}

async function cartItemCreator(event) {
  const itemId = await getSkuFromProductItem(event.target.parentElement);
  const objectItem = await getItem(itemId);
  document.querySelector('.cart__items').appendChild(createCartItemElement(objectItem));
  setLocalStorage();
  totalPrice();
}

function eraseList() {
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  setLocalStorage();
  totalPrice();
}

function addListeners() {
  document.querySelectorAll('button.item__add')
    .forEach((item) => item.addEventListener('click', cartItemCreator));
  document.querySelector('.empty-cart').addEventListener('click', eraseList);
}

window.onload = () => {
  getProducts('computador', addListeners);
  listaItens = document.querySelector('.items');
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('stored');
  document.querySelectorAll('.cart__item')
    .forEach((elem) => elem.addEventListener('click', cartItemClickListener));
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

/* Requisito 3
  1 - A função cartItemClickListener deve remover os itens da lista (.remove())
  2 - Os listeners devem ser adicionados toda vez que a página é atualizada.
*/

/* Requisito 4
  1 - O HTML interno da lista deve ser adicionado ao local storage, na função setLocalStorage
  2 - Ao atualizar a página, o HTML interno da lista deve ser readicionado à lista de carrinho de compras
*/

// MUITO OBRIGADO LYS PRESTES, ISAAC MATHEUS E PALLY OLIVEIRA POR ESTA GRANDE AJUDA!
// AGRADEÇO TAMBÉM À CARLA POR TER AJUDANDO COM O REQUISITO 5!! MUITO OBRIGADO!!