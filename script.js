let idPrices = {};
let productStorage = [];
const fetchProducts = [];
const query = 'computadores';
const queryURL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const itemsSection = document.querySelector('.items');

function loading() {
  const span = document.createElement('span');
  const cartSection = document.querySelector('.cart');
  span.className = 'loading';
  span.innerText = 'loading...';
  cartSection.appendChild(span);
}

function ready() {
  const loadingSpan = document.querySelector('.loading');
  loadingSpan.remove();
}

async function getJSON() {
  loading();
  const responseRaw = await fetch(queryURL).then((response) => {
    ready();
    return response.json();
  });
  return responseRaw;
}

async function mapJSON() {
  const { results } = await getJSON();
  results.map((crr) => {
    const { id: sku, title: name, price: salePrice, thumbnail: image } = crr;
    return fetchProducts.push({ sku, name, salePrice, image });
  });
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updatePrice() {
  const currentTotal = Object.values(idPrices).reduce((acc, crr) => acc + crr, 0);
  totalPrice.innerText = currentTotal.toFixed(2);
  localStorage.setItem('currentTotalStorage', currentTotal);
}

function saveLocalStorage() {
  const toString = JSON.stringify(productStorage);
  localStorage.setItem('cartListStorage', toString);
}

function cartItemClickListener(event) {
  const sku = event.target.innerText.slice(5, 18);
  delete idPrices[sku];
  const temp = productStorage.filter((crr) => crr.sku !== sku);
  productStorage = temp;
  event.target.remove();
  updatePrice();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const parent = event.target.parentElement;
  const id = getSkuFromProductItem(parent);
  const itemURL = `https://api.mercadolibre.com/items/${id}`;
  loading();
  const responseJSON = await fetch(itemURL).then((response) => {
    ready();
    return response.json();
  });
  const { id: sku, title: name, price: salePrice } = responseJSON;
  const item = { sku, name, salePrice };
  productStorage.push(item);
  idPrices[sku] = salePrice;
  const product = createCartItemElement(item);
  cartList.append(product);

  updatePrice();
  saveLocalStorage();
}

function createCustomElement(element, className, innerText) {
  if (element === 'button') {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', addToCart);
    return e;
  }
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

async function renderProducts() {
  await mapJSON();
  for (let i = 0; i < fetchProducts.length; i += 1) {
    const product = createProductItemElement(fetchProducts[i]);
    itemsSection.appendChild(product);
  }
}

function emptyCart() {
  idPrices = {};
  productStorage = [];
  totalPrice.innerText = '';
  cartList.innerHTML = '';
  localStorage.clear();
}

function loadLocalStorage() {
  const loadList = localStorage.getItem('cartListStorage');
  const toObject = JSON.parse(loadList);
  
  if (toObject !== null) {
    toObject.forEach((crr) => {
      const product = createCartItemElement(crr);
      cartList.append(product);
    });
  }
}

function eventButtons() {
  const cartEmptyBtn = document.querySelector('.empty-cart');
  cartEmptyBtn.addEventListener('click', emptyCart);
}

window.onload = () => { 
  renderProducts();
  eventButtons();
  loadLocalStorage();
};
