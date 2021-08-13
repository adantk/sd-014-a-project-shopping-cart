const QUERY = 'computador';
const cart = document.querySelector('.cart__items');
const emptyCart = document.querySelector('.empty-cart');
const totalprice = document.querySelector('.total-price');
const saveCart = () => {
  localStorage.setItem('cartContentList', (cart.innerHTML));
  localStorage.setItem('totalPrice', (totalprice.innerHTML));
};

async function cartItemClickListener(event) {
  const itemId = (event.target.innerText).split(' ')[1];
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const addition = await response.json();
  totalprice.innerText = await Math.abs(totalprice.innerText) - Math.abs(addition.price);
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

function createProductItemElement({ id: sku, title: name, thumb: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

emptyCart.addEventListener('click', () => {  
  cart.innerHTML = null;
  totalprice.innerText = 0;
  saveCart();
});

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function idFetch(event) {
  const item = event.target.parentElement;
  const itemId = getSkuFromProductItem(item);
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const addition = await response.json();
  const itemAdition = createCartItemElement(addition);
  await cart.appendChild(itemAdition);
  totalprice.innerText = await Math.abs(totalprice.innerText) + Math.abs(addition.price);
  await saveCart();
}

const addChild = (items) => {
  items.forEach((item) => {
    const newItem = createProductItemElement(item);
    const itemlist = document.querySelector('.items');
    itemlist.appendChild(newItem);
  });
  const itemButton = document.querySelectorAll('.item__add');
  itemButton.forEach((button) => button.addEventListener('click', idFetch));
};

async function getApi() { 
  const itemConteiner = document.querySelector('.items');
  try {
  itemConteiner.innerHTML = '<p class = "loading"> Loading...</p>';
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const data = await response.json();
  itemConteiner.innerHTML = null;
  (addChild(data.results));
  return data;
  } catch (error) {
  alert('Deu ruim!');
  }
}

window.onload = () => {
  getApi();
  const cartSaver = (localStorage.getItem('cartContentList'));
  (cart.innerHTML = cartSaver);
  const priceSaver = (localStorage.getItem('totalPrice'));
  (totalprice.innerHTML = priceSaver);
  const cartItem = cart.querySelectorAll('.cart__item');
  cartItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
};
