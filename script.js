const urlBase = 'https://api.mercadolibre.com/';
const savedProduct = document.querySelector('.cart__items');
const amount = document.querySelector('.total-price');
const cleanCart = document.querySelector('.empty-cart');
let productsListing = [];

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

const saveLocalStorage = async () => {
  localStorage.setItem('key', savedProduct.innerHTML);
};

const sumAllPrices = () => {
  const listItems = document.querySelectorAll('.cart__item');
  let sumOfPrices = 0;
  listItems.forEach((item) => {
    const itemPrice = item.innerText.match(/(?<=PRICE: \$).*/)[0];
    sumOfPrices += parseFloat(itemPrice);
  });
  amount.innerText = sumOfPrices;
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  sumAllPrices();
}

const getFromLocal = async () => {
  savedProduct.innerHTML = await localStorage.getItem('key');
  const cartItemsSaved = await document.querySelectorAll('.cart__items');
  cartItemsSaved.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveLocalStorage();
  return li;
}

const addItemToCart = async (event) => {
  const idProduct = event.target.parentNode.firstChild.innerText;
  const request = await fetch(`${urlBase}items/${idProduct}`);
  const response = await request.json();
  const cartItem = createCartItemElement(response);
  savedProduct.appendChild(cartItem);
  saveLocalStorage();
  sumAllPrices();
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemToCart);
  return section;
}

const addProductsToSite = (list) => {
  const showItems = document.querySelector('.items');
  list.forEach((product) => {
    showItems.appendChild(createProductItemElement(product));
  });
};

const productsSearchApi = async (item) => {
  productsListing = [];
  const productsList = await fetch(`${urlBase}sites/MLB/search?q=${item}`);
  productsListing = await productsList.json();
  return addProductsToSite(productsListing.results);
};

const emptyCart = () => {
  cleanCart.addEventListener('click', () => {
    savedProduct.innerHTML = '';
    saveLocalStorage();
    sumAllPrices();
  });
};

window.onload = () => {
  productsSearchApi('computador');
  getFromLocal();
  emptyCart();
 };
