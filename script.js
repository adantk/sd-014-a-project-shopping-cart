const keyWord = 'computador';

const itemContainer = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const totalToPay = document.querySelector('.total-price');
const emptyCartBtn = document.querySelector('.empty-cart');

function createLoadingElement() {
  const loadingElement = document.createElement('h3');
  loadingElement.innerHTML = 'loading';
  loadingElement.classList.add('loading');
  document.querySelector('.cart').appendChild(loadingElement);
}

function removeLoadingElement() {
  const buh = document.querySelector('.loading');
  buh.remove();
  console.log('im here');
}

function updateLocalStorage() {
  localStorage.setItem('cart', cart.innerHTML);
}

async function updateValueToPay() {
  let total = 0;
  const cartList = document.querySelectorAll('.cart__item');
  cartList.forEach((item) => {
    const price = parseFloat(item.innerText.split('$')[1]);
    total += price;
  });
  if (total > 0) {
    totalToPay.innerHTML = total;
  } else {
    totalToPay.innerHTML = '';
  }
}

function emptyCart() {
  cart.innerText = '';
  updateLocalStorage();
  updateValueToPay();
}

emptyCartBtn.addEventListener('click', emptyCart);

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

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage();
  updateValueToPay();
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
  createLoadingElement();
  const itemObj = await (await fetch(`https://api.mercadolibre.com/items/${itemID}`)).json();
  removeLoadingElement();
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement(itemObj));
  updateLocalStorage();
  updateValueToPay();
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
  createLoadingElement();
  const response = await (await fetch(url)).json();
  removeLoadingElement();
  response.results.forEach((element) => {
    itemContainer.appendChild(createProductItemElement(element));
  });
  addClickEventToItemList();
  loadLocalStorage();
}

window.onload = () => {
  search();
};