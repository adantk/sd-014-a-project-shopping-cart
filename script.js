const itemSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const clearBtn = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const total = document.querySelector('.total-price');

// Requisito 7
const killLoad = () => {
  loading.parentNode.removeChild(loading);
};

// Requisito 1
// O próprio VS Code sugeriu e transformou as funções em async
const fetchProducts = async (query) => {
  const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const data = await resp.json();
  killLoad();
  return data.results;
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

// Requisito 5
const totalPrice = () => {
  let getTotal = 0;
  cartItems.childNodes.forEach((item) => {
    getTotal += parseFloat(item.innerText.split('$')[1]);
  });
  total.innerText = `${getTotal}`;
  localStorage.setItem('price', total.innerHTML);
};
// referência https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/parseFloat

// Requisito 3
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  localStorage.setItem('list', cartItems.innerHTML);
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
const addToCart = () => {
  itemSection.addEventListener('click', async (event) => {
    if (event.target.classList.contains('item__add')) {
      const idSku = getSkuFromProductItem(event.target.parentElement);
      const resp = await fetch(`https://api.mercadolibre.com/items/${idSku}`);
      const data = await resp.json();
      cartItems.appendChild(createCartItemElement(data));
      totalPrice();
      localStorage.setItem('list', cartItems.innerHTML);
    }
  });
};

// Requisito 6
const emptyCart = () => {
  clearBtn.addEventListener('click', () => {
    cartItems.innerHTML = '';
    total.innerHTML = '';
    localStorage.removeItem('list');
    localStorage.removeItem('price');
  });
};

// Requisito 4
const storedCart = () => {
  if (localStorage) {
    cartItems.innerHTML = localStorage.getItem('list');
    total.innerHTML = localStorage.getItem('price');
  }
  cartItems.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));
};

window.onload = () => {
  // Requisito 1
  fetchProducts('computador')
  .then((results) => results.forEach((result) => {
    itemSection.appendChild(createProductItemElement(result));
  }));
  // Requisito 2
  addToCart();
  // Requisito 4
  storedCart();
  // Requisito 6
  emptyCart();
};