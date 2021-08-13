const baseUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemsUrl = 'https://api.mercadolibre.com/items/';
let cart;
let priceWrap;

function pushToLocalStorage() {
  localStorage.setItem('items', cart.innerHTML);
  localStorage.setItem('price', priceWrap.innerText);
}

function updateTotalPrice(price) {
  priceWrap = document.querySelector('.total-price');
  const newValue = Number(priceWrap.innerText) + Number(price);
  priceWrap.innerText = newValue;
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

function cartItemClickListener(event) {
  const negativePrice = event.target.innerText.split(' $')[1] * -1;
  event.target.remove();
  updateTotalPrice(negativePrice);
  pushToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = `cart__item ${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function changeDisplay() {
  const loading = document.querySelector('.loading');
  const content = document.querySelector('.container');

  loading.remove();
  content.style.display = 'flex';
}

async function fetchData(url) {
  const results = await fetch(url)
    .then((res) => res.json());
  return results;
}

function appendItem(item, classElement) {
  document.querySelector(classElement).appendChild(item);
}

async function processItemToCart(id) {
  const { title, price } = await fetchData(itemsUrl + id);
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  appendItem(item, '.cart__items');
  updateTotalPrice(price);
  pushToLocalStorage();
}

function addCartButtonListener() {
  const addItem = document.querySelectorAll('.item__add');
  addItem.forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      processItemToCart(ev.target.parentElement.firstChild.innerText);
    });
  });
}

function pullFromLocalStorage() {
  cart = document.querySelector('.cart__items');
  priceWrap = document.querySelector('.total-price');

  cart.innerHTML = localStorage.getItem('items') || '';
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });

  priceWrap.innerText = localStorage.getItem('price') || '';
}

function emptyCartButtonListener() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    cart.innerHTML = '';
    priceWrap.innerHTML = '';
  });
}

window.onload = async () => {
  const { results } = await fetchData(baseUrl);

  pullFromLocalStorage();

  await results.forEach((element) => {
    const infos = { 
      sku: element.id, 
      name: element.title, 
      image: `${element.thumbnail.slice(0, -5)}L.jpg`, 
    };
    appendItem(createProductItemElement(infos), '.items');
  });

  changeDisplay();
  addCartButtonListener();
  emptyCartButtonListener();
};