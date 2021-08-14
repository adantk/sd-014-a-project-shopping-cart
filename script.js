const fetchProducts = [];
const query = 'computadores';
const queryURL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const cartList = document.querySelector('.cart__items');
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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  console.log('2tei');
  const parent = event.target.parentElement;
  // console.log(parent);
  const id = getSkuFromProductItem(parent);
  // console.log(id);
  const itemURL = `https://api.mercadolibre.com/items/${id}`;
  loading();
  const responseJSON = await fetch(itemURL).then((response) => {
    ready();
    return response.json();
  });
  // console.log(responseJSON);
  const { id: sku, title: name, price: salePrice } = responseJSON;
  // console.log(sku + name + salePrice);
  const item = { sku, name, salePrice };
  // console.log(item);
  const product = createCartItemElement(item);
  cartList.appendChild(product);
}

function createCustomElement(element, className, innerText) {
  if (element === 'button') {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', addToCart);
    console.log('tei');
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
  cartList.innerHTML = '';
  localStorage.clear();
}

function eventButtons() {
  // const btnItems = document.querySelector('.items');
  const cartEmptyBtn = document.querySelector('.empty-cart');
  // btnItems.addEventListener('click', addToCart);
  cartEmptyBtn.addEventListener('click', emptyCart);
}

window.onload = () => { 
  renderProducts();
  eventButtons();
};
