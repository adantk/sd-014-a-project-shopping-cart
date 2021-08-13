const ENDPOINTS = {
  list: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  item: 'https://api.mercadolibre.com/items/',
};

const CART = [];

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const productId = event.target.dataset.id;
  CART.splice(CART.indexOf(productId), 1);
  localStorage.setItem('CART', JSON.stringify(CART));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

async function fetchProductInfo(productId) {
  return fetchMLData(ENDPOINTS.item, productId)
  .then(({ title: name, price: salePrice }) => (
    { sku: productId, name, salePrice }
  ));
}

async function addProductToCart(productId) {
  const productInfo = await fetchProductInfo(productId);
  const cartItemElement = createCartItemElement(productInfo);
  cartItemElement.addEventListener('click', cartItemClickListener);
  cartItemElement.dataset.id = productInfo.sku;
  document.querySelector('.cart__items').appendChild(cartItemElement);
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

async function loadCart() {
  CART.push(...JSON.parse(localStorage.getItem('CART') || '[]'));
  if (CART.length > 0) {
    CART.forEach(async (cartProductID) => {
      await addProductToCart(cartProductID);
    });
  } else {
    localStorage.setItem('CART', JSON.stringify(CART));
  }
}

function clickAddProductToCartListener(event) {
  if (event.target.classList.contains('item__add')) {
    const productId = getSkuFromProductItem(event.target.parentElement);
    addProductToCart(productId);
    CART.push(productId);
    localStorage.setItem('CART', JSON.stringify(CART));
  }
}

/** Carregamento de dados e preparação de listeners */
async function preparePage() {
  const productsSection = document.querySelector('.items');
  await addProducts(productsSection);
  await loadCart();
  productsSection.addEventListener('click', clickAddProductToCartListener);
}

window.onload = () => { 
  preparePage();
};
