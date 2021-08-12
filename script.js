const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_ITEM = 'https://api.mercadolibre.com/items/';
const itemsContainer = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

const sum = (a, b) => a + b;
const sub = (a, b) => a - b;

const updatePrice = (price, callback) => {
  totalPrice.innerText = callback(parseFloat(totalPrice.innerText, 10), price);
};

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  if (event.target.className === 'cart__item') {
    const item = event.target;
    const price = parseFloat(item.innerText.match(/\$(.*)/)[1]);
    updatePrice(price, sub);
    cartItems.removeChild(item);
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = (URL) => fetch(URL).then((response) => response.json());

const fetchItems = () => {
  fetchAPI(API_URL)
    .then(({ results }) => {
      results.forEach((item) => { itemsContainer.appendChild(createProductItemElement(item)); });
    });
};

const addItemsToCart = (event) => {
  const addButton = event.target;
  if (addButton.className === 'item__add') {
    const itemId = getSkuFromProductItem(addButton.parentElement);
    fetchAPI(API_ITEM + itemId)
      .then((itemInfo) => {
        cartItems.appendChild(createCartItemElement(itemInfo));
        updatePrice(itemInfo.price, sum);
      });
  }
};

window.onload = () => {
  fetchItems();
};

itemsContainer.addEventListener('click', addItemsToCart);
cartItems.addEventListener('click', cartItemClickListener);
