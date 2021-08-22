const itemContainer = document.querySelector('.items');
const shoppingCart = document.querySelector('.cart__title');
const cart = document.querySelector('.cart__items');

const keyWord = 'computador';

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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
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

function updateLocalStorage() {
  localStorage.setItem('cart', cart.innerHTML);
 }

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage();
}

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const itemID = getSkuFromProductItem(event.target.parentNode);
  const itemObj = await (await fetch(`https://api.mercadolibre.com/items/${itemID}`)).json();
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement(itemObj));
  updateLocalStorage();
}

function addClickEventToItemList() {
  const listButtons = document.querySelectorAll('.item__add');
  listButtons.forEach((button) => button.addEventListener('click', addItemToCart));
}

function addClickEventToCartList() {
  const itemsSavedOnCart = document.querySelectorAll('.cart__item');
  itemsSavedOnCart.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

function loadLocalStorage() {
  if (localStorage.length > 0) {
    cart.innerHTML = localStorage.getItem('cart');
  }
  addClickEventToCartList();
}

async function search() {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${keyWord}`;
  const response = await (await fetch(url)).json();
  response.results.forEach((element) => {
    itemContainer.appendChild(createProductItemElement(element));
  });
  addClickEventToItemList();
  loadLocalStorage();
}

window.onload = () => {
  search();
};