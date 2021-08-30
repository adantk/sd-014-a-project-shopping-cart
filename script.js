const urlBase = 'https://api.mercadolibre.com/';
const savedProduct = document.querySelector('.cart__items');
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

const saveProduct = async () => {
  localStorage.setItem('key', savedProduct.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  saveProduct();
}

const getFromLocal = () => {
  savedProduct.innerHTML = localStorage.getItem('key');
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event) => {
  const cart = document.querySelector('.cart__items');
  const idProduct = event.target.parentNode.firstChild.innerText;
  const request = await fetch(`${urlBase}items/${idProduct}`);
  const response = await request.json();
  const cartItem = createCartItemElement(response);
  cart.appendChild(cartItem);
  saveProduct();
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

const addProduct = (list) => {
  const showItems = document.querySelector('.items');
  list.forEach((product) => {
    showItems.appendChild(createProductItemElement(product));
  });
};

const productsSearchApi = async (item) => {
  productsListing = [];
  const productsList = await fetch(`${urlBase}sites/MLB/search?q=${item}`);
  productsListing = await productsList.json();
  return addProduct(productsListing.results);
};

window.onload = () => {
  productsSearchApi('computador');
  getFromLocal();
 };
