const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const lista = document.querySelector('.cart__items');
const total = document.querySelector('.total-price');
const btnEmpty = document.querySelector('.empty-cart');

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

const updatePrice = (productPrice) => {
  const current = Number(total.innerHTML);
  total.innerHTML = current + productPrice;
};

// Requisito #4
const updateList = () => {
  localStorage.setItem('lista', lista.innerHTML);
};

// Requisito #2
const fetchChosenItem = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await response.json();
  const obj = { sku: item.id, name: item.title, salePrice: item.price };
  return obj;
};

// Requisito #3
async function cartItemClickListener(event) {
  // coloque seu código aqui
  const id = event.target.innerText.split(' ')[1];
  const item = await fetchChosenItem(id);
  lista.removeChild(event.target);
  updateList();
  updatePrice(item.salePrice * (-1));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addLoading = () => {
  const load = document.createElement('h1');
  load.innerHTML = 'Loading...';
  load.className = 'loading';
  document.body.appendChild(load);
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

const addItemToCart = async (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  addLoading();
  const info = await fetchChosenItem(id);
  removeLoading();
  const newLi = createCartItemElement(info);
  lista.appendChild(newLi);
  updateList();
  updatePrice(info.salePrice);
};

// Requisito #1
const fetchProducts = async () => {
  const response = await fetch(API_URL);
  const jsonResponse = await response.json();
  return jsonResponse.results;
};

const createItemListener = () => {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach((btn) => {
    btn.addEventListener('click', addItemToCart);
  });
};

const addItems = async () => {
  addLoading();
  const results = await fetchProducts();
  removeLoading();
  results.forEach((result) => {
    const info = { sku: result.id, name: result.title, image: result.thumbnail };
    const product = createProductItemElement(info);
    document.querySelector('.items').appendChild(product);
  });
  createItemListener();
};

const getSavedItems = () => {
  lista.innerHTML = localStorage.getItem('lista');
};

const addCartItemListener = () => {
  getSavedItems();
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

const emptyCart = () => {
  lista.innerHTML = '';
  total.innerHTML = 0;
  localStorage.setItem('lista', '');
};
btnEmpty.addEventListener('click', emptyCart);

const setInitialPrice = () => {
  const allItems = document.querySelectorAll('.cart__item');
  let initialPrice = 0;
  allItems.forEach((item) => {
    initialPrice += Number(item.innerText.split('$')[1]);
  });
  total.innerHTML = initialPrice;
};

window.onload = () => {
  addItems();
  addCartItemListener();
  setInitialPrice();
};
