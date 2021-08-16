/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const UrlBase = 'https://api.mercadolibre.com/sites/MLB/';
const UrlProduto = 'https://api.mercadolibre.com/items/';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function ProductSeku(sku) {
  const response = await fetch(`${UrlProduto}${sku}`);
  const product = await response.json();
  return product;
}

async function addToCart() {
  const sku = getSkuFromProductItem(this.parentElement);
  createCartItemElement(await ProductSeku(sku));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') e.addEventListener('click', addToCart);
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
  const CartItems = document.querySelector('.cart__items');
  CartItems.appendChild(li);
  return li;
}

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/await
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/async_function
// https://thoughtbot.com/blog/good-things-come-to-those-who-await#:~:text=returns%20a%20promise%3A-,const%20response%20%3D%20await%20fetch(%22https%3A%2F%2Fapi.example,value%20we%20assign%20to%20response%20.
async function Products() {
  const response = await fetch(`${UrlBase}/search?q=computador`);
  const produto = await response.json();
  return produto;
}

window.onload = async () => {
  const produtos = await Products();
  produtos.results.forEach((product) => {
    const element = createProductItemElement(product);
    const items = document.querySelector('.items');
    items.appendChild(element);
  });
};
