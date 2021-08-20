let TOTAL_PRICE = 0;

function calculateResult(price = 0) {
  const priceTable = document.querySelector('.total-price');
  TOTAL_PRICE += price;
  priceTable.innerHTML = `${TOTAL_PRICE}`;
}

function saveCart() {
  const cart = document.getElementsByClassName('cart__item');
  const items = [];
  for (let index = 0; index < cart.length; index += 1) {
  items.push(cart[index].innerText);
  }
  localStorage.cart = JSON.stringify(items);
  localStorage.price = TOTAL_PRICE.toFixed(2);
}

function cartItemClickListener(event) {
  const number = Number(event.target.innerText.split('PRICE: $')[1]);
  const wishList = (event.target).parentNode;
  wishList.removeChild(event.target);
  calculateResult(-number);
  saveCart();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  calculateResult(salePrice);
  return li;
}

function addItemOnCart(event) {
  const ItemID = (((event.target).parentNode).firstChild.innerText);
  const cartList = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((data) => data.json())
  .then((product) => cartList.appendChild(createCartItemElement(product)))
  .then(() => saveCart());
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addItemOnCart);
  }
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

function recreateCartItemElement(string) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = string;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((data) => data.json())
  .then(({ results }) => results.forEach((obj) => {
    document.querySelector('.items').appendChild(createProductItemElement(obj));
  }));
}

function reloadCart() {
  const list = localStorage.cart;
  (JSON.parse((list))).forEach((element) => {
    document.querySelector('.cart__items').appendChild(recreateCartItemElement(element));
  });
  const localStoragePrice = localStorage.price;
  TOTAL_PRICE = Number(localStoragePrice);
  calculateResult();
}

window.onload = () => {
  getProducts();
  if (localStorage.cart) {
  reloadCart();
  }
};