const CART_ITEMS = 'cart-items';

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

const localStorageInput = (item) => {
  const localData = JSON.parse(localStorage.getItem(CART_ITEMS));
  const data = (localStorage.getItem(CART_ITEMS) != null) ? localData : [];
  data.push(item);
  localStorage.setItem(CART_ITEMS, JSON.stringify(data));
};

const cartItemElementToObj = (element) => {
  const array = element.innerText.split(' | ');
  const arrayObj = [];
  array.forEach((string) => {
    if (string !== undefined) {
      arrayObj.push(string.split(': '));
    }
  });
  return Object.fromEntries(arrayObj);
};

const localStorageOutPut = (item) => {
  const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
  const newCartItems = [];
  cartItems.forEach((cartItem) => {
    const { SKU: skuRemoveItem } = cartItemElementToObj(item);
    if (cartItem.sku !== skuRemoveItem) {
      newCartItems.push(cartItem);
    } 
  });
  localStorage.removeItem(CART_ITEMS);
  newCartItems.forEach((cartItem) => localStorageInput(cartItem));
};

async function setupCartTotalPrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  const cartPricesArray = [];
  cartItems.forEach((item) => { 
    cartPricesArray.push(parseFloat(item.innerText.split('| PRICE: $')[1]));
  });
  const totalPrice = await cartPricesArray.reduce((acc, price) => acc + price, 0);
  document.querySelector('.total-price').innerText = `${totalPrice}`;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  localStorageOutPut(item);
  item.parentNode.removeChild(item);
  setupCartTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCartAPI = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const cartItemElement = createCartItemElement({ sku, name, salePrice });
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(cartItemElement);
    localStorageInput(({ sku, name, salePrice }));
    setupCartTotalPrice();
  })
  .catch((error) => console.log(error, 'errou'));
};

const loadingEventHandler = () => {
  const loading = document.querySelector('.loading');
  loading.parentNode.removeChild(loading);
};

const fetchAPI = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((object) => {
    const { results } = object;
    return results;
  })
  .then((results) => results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const item = createProductItemElement({ sku, name, image });
    const itemButton = item.querySelector('.item__add');
    itemButton.addEventListener('click', (event) => {
      const itemId = getSkuFromProductItem(event.target.parentNode);
      fetchCartAPI(itemId);
    });
    const items = document.querySelector('.items');
    items.appendChild(item);
  }))
  .then(() => loadingEventHandler())
  .catch((error) => console.log(error, 'errou'));
};

const clearCartList = () => {
  const list = document.querySelectorAll('.cart__item');
  list.forEach((li) => li.parentNode.removeChild(li));
  setupCartTotalPrice();
};

const clearCartListEventHandler = () => {
  const clearListButton = document.querySelector('.empty-cart');
  clearListButton.addEventListener('click', clearCartList);
};

const setupLocalStorageRecovery = () => {
  const localData = JSON.parse(localStorage.getItem(CART_ITEMS));
  const cartItems = document.querySelector('.cart__items');
  
  if (localData !== null) {
    localData.forEach((item) => {
      const cartItemElement = createCartItemElement(item);
      cartItems.appendChild(cartItemElement);
    });
  } 
  setupCartTotalPrice();
};

const setupEventHandlers = () => {
  setupLocalStorageRecovery();
  fetchAPI('computador');
  clearCartListEventHandler();
};

window.onload = () => { setupEventHandlers(); };
