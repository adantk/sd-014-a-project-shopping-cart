const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const lista = document.querySelector('.cart__items');

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

function createProductItemElement({ sku, name, image }) {
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

// Requisito #3
function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito #2
const addItemToCart = async (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await response.json();
  const info = { sku: item.id, name: item.title, salePrice: item.price };
  const newLi = createCartItemElement(info);
  document.querySelector('.cart__items').appendChild(newLi);
  localStorage.setItem('lista', lista.innerHTML);
};

// Requisito #1
const fetchItems = async () => {
  const response = await fetch(API_URL);
  const jsonResponse = await response.json();
  return jsonResponse.results;
};

// Requisito #2
const createItemListener = () => {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach((btn) => {
    btn.addEventListener('click', addItemToCart);
  });
};

const addItems = async () => {
  const results = await fetchItems();
  results.forEach((result) => {
    const info = { sku: result.id, name: result.title, image: result.thumbnail};
    const product = createProductItemElement(info);
    document.querySelector('.items').appendChild(product);
  })
  createItemListener();
}

const getItems = () => {
  const info = localStorage.getItem('lista');

  if (info) {
    document.querySelector(lista).innerHTML = info;
    const items = document.querySelectorAll('.cart__item');
    items.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }

};

window.onload = () => {
  addItems()
  getItems();
};
