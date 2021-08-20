function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveCart() {
  const cart = document.getElementsByClassName('cart__item');
  const items = [];
  for (let index = 0; index < cart.length; index += 1) {
  items.push(cart[index].innerText);
  }
  localStorage.cart = JSON.stringify(items);
}

function cartItemClickListener(event) {
  const wishList = (event.target).parentNode;
  wishList.removeChild(event.target);
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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
}

window.onload = () => {
  getProducts();
  if (localStorage.cart) {
  reloadCart();
  }
};