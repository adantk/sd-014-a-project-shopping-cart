const ENDPOINTS = {
  list: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  item: 'https://api.mercadolibre.com/items/',
};

const CART = [];

// gera um número praticamente aleatório
// https://dev.to/rahmanfadhil/how-to-generate-unique-id-in-javascript-1b13
function getRandomID() { return (Math.random() * Date.now()).toString(); }

function updateCart() {
  localStorage.setItem('CART', JSON.stringify(CART));
  const total = CART.reduce((sum, item) => sum + item.salePrice, 0);
  const priceElement = document.querySelector('.total-price');
  priceElement.innerText = total;
}

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

function toggleLoading() {
  if (document.querySelector('.loading') === null) {
    const loadingElement = createCustomElement('div', 'loading', 'Loading...');
    document.body.appendChild(loadingElement);
  } else {
    document.querySelector('.loading').remove();
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartItemId = event.target.dataset.id;
  const productInfo = CART.find((product) => product.id === cartItemId);
  CART.splice(CART.indexOf(productInfo), 1);
  event.target.remove();
  updateCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCart(productInfo) {
  const cartItemElement = createCartItemElement(productInfo);
  cartItemElement.addEventListener('click', cartItemClickListener);
  cartItemElement.dataset.id = productInfo.id;
  cartItemElement.dataset.sku = productInfo.sku;
  cartItemElement.dataset.price = productInfo.salePrice;
  document.querySelector('.cart__items').appendChild(cartItemElement);
}

/**
 * Busca dados da API do Mercado Livre
 * @param {string} endpoint Endpoint da API
 * @param {string=} query (opcional) Consulta
 * @returns JSON da consulta
 */
async function fetchMLData(endpoint, query) {
  const path = `${endpoint}${query || ''}`;
  const response = await fetch(path);
  const data = await response.json();
  return data;
}

async function fetchProductInfo(productSku) {
  return fetchMLData(ENDPOINTS.item, productSku)
  .then(({ title: name, price: salePrice }) => (
    { sku: productSku, name, salePrice }
  ));
}

/** Adiciona os produtos na seção principal */
async function addProducts(section) {
  const products = await fetchMLData(ENDPOINTS.list, 'computador')
    .then((data) => data.results);
  products.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const product = createProductItemElement({ sku, name, image });
    section.appendChild(product);
  });
}

function loadCart() {
  CART.push(...JSON.parse(localStorage.getItem('CART') || '[]'));
  if (CART.length > 0) {
    CART.forEach((cartProductInfo) => {
      addProductToCart(cartProductInfo);
    });
  } 
  updateCart();
}

async function clickAddProductToCartListener(event) {
  if (event.target.classList.contains('item__add')) {
    const productSku = getSkuFromProductItem(event.target.parentElement);
    const productInfo = await fetchProductInfo(productSku);
    productInfo.id = getRandomID(); 
    addProductToCart(productInfo);
    CART.push(productInfo);
    updateCart();
  }
}

function clickClearCartListener() {
  document.querySelector('.cart__items').innerHTML = '';
  CART.length = 0;
  updateCart();
}

/** Carregamento de dados e preparação de listeners */
async function preparePage() {
  const productsSection = document.querySelector('.items');
  const clearCartButton = document.querySelector('.empty-cart');
  await addProducts(productsSection);
  loadCart();
  productsSection.addEventListener('click', clickAddProductToCartListener);
  clearCartButton.addEventListener('click', clickClearCartListener);
  toggleLoading();
}

window.onload = () => { 
  preparePage();
  toggleLoading();
};
