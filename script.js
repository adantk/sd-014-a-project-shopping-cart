const cartItemsClass = '.cart__items';
const totalPriceCart = '.total-price';
let cartPrice = 0;

const whileLoading = () => {
  const loading = document.createElement('span');
  loading.innerHTML = 'loading...';
  loading.className = 'loading';
  const loadingPlace = document.querySelector('.cart');
  loadingPlace.appendChild(loading);
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const savePriceToLocalStorage = (totalPrice) => {
  localStorage.setItem('totalPrice', totalPrice.innerHTML);
  };

const addPriceItem = (price) => {
  const totalPrice = document.querySelector(totalPriceCart);
  cartPrice += price;
  totalPrice.innerHTML = cartPrice;
  savePriceToLocalStorage(totalPrice);
};

const removePriceItem = (price) => {
  const totalPrice = document.querySelector(totalPriceCart);
  cartPrice -= price;
  totalPrice.innerHTML = cartPrice;
  savePriceToLocalStorage(totalPrice);
};

const saveToLocalStorage = (cart) => { 
  localStorage.setItem('cartList', cart.innerHTML);
};

async function cartItemClickListener(event) {
  const cart = document.querySelector(cartItemsClass);
  const itemHtml = event.target.innerHTML;
  const priceItem = Number(itemHtml.split('PRICE: $')[1]);
  removePriceItem(priceItem);
  event.target.remove();
  saveToLocalStorage(cart);
}

const loadCartFromStorage = () => {
  const cart = document.querySelector(cartItemsClass);
  const cartLocalStorage = localStorage.getItem('cartList');
  const priceLocalStorage = localStorage.getItem('totalPrice');
  cart.innerHTML = (cartLocalStorage);
  if (priceLocalStorage) cartPrice = priceLocalStorage;
  Array.from(cart.children).forEach((item) => 
    item.addEventListener('click', cartItemClickListener));
    /** Consultei o repositório do Gustavo Dias para resolver essa parte final com 'cart.children'
    * Link: https://github.com/tryber/sd-014-a-project-shopping-cart/tree/gustavo-dias-project-shopping-cart
    */ 
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function getSkuFromProductItem(item) {
  const addButton = await item.target.parentNode;
  return addButton.querySelector('span.item__sku').innerText;
}

const fetchRequestEndpoint = async (idProduct) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
  const responseJson = await responseRaw.json();
  return responseJson;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event) => {
  whileLoading();
  const idProductAdd = await getSkuFromProductItem(event);
  const returnEndPoint = await fetchRequestEndpoint(idProductAdd);
  const { id, title, price } = await returnEndPoint;
  const cart = document.querySelector(cartItemsClass);
  cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  saveToLocalStorage(cart);
  addPriceItem(price);
  removeLoading();
};

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
  const button = document.querySelectorAll('.item__add');
  button.forEach((btn) => btn.addEventListener('click', addItemToCart));
  return section;
}

const fetchProduct = async (search) => {
 const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
 const responseJson = await responseRaw.json();
 return responseJson.results;
};

const loadElements = async (search) => {
  whileLoading();
  const result = await fetchProduct(search);
  result.forEach(({ id, title, thumbnail }) => document.querySelector('.items')
    .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
  removeLoading();
};

const createTagTotalPrice = () => {
  const totalPrice = document.createElement('span');
  totalPrice.className = 'total-price';
  
  totalPrice.innerHTML = cartPrice;
  const cart = document.querySelector('.cart');
  cart.appendChild(totalPrice);
};

const emptyCart = () => {
  const cart = document.querySelector(cartItemsClass);
  cart.innerHTML = '';
  const totalPrice = document.querySelector(totalPriceCart);
  cartPrice = 0;
  totalPrice.innerHTML = 0;
  localStorage.setItem('cartList', '');
  localStorage.setItem('totalPrice', 0);
};

const emptyButton = () => {
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', emptyCart);
};

window.onload = () => {
  emptyButton();
  loadElements('computador');
  loadCartFromStorage();
  createTagTotalPrice();
};