let cartItems;
// Declared in the upper scope because script.js is linked to header on HTML => later on it will be fulfilled

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

// function cartItemClickListener(event) {
// }
// New one created down below

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  // New one created down below
  return li;
}

async function getItems(query) {
  if (!query) alert('Nenhum termo informado');

  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.results) return json.results;

    throw new Error('Endpoint não existe');
  } catch (error) {
    console.log(error);
  }
}

async function appendItems(query) {
  const itemsSection = document.querySelector('.items');

  const itemsList = await getItems(query);

  if (itemsList) {
    itemsList.forEach(({ id, title, thumbnail }) => {
      const itemElement = createProductItemElement({ id, title, thumbnail });

      itemsSection.appendChild(itemElement);
    });
  }
}

async function fetchItemID(id) {
  if (!id) alert('ID não informado');

  const url = `https://api.mercadolibre.com/items/${id}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json) return json;

    throw new Error('Endpoint não existe');
  } catch (error) {
    console.log(error);
  }
}

function saveToLocalStorage() {
  localStorage.setItem('cartList', cartItems.innerHTML);
  // Sets cartItems as the value of the key 'cartList' in the local storage
}

function loadLocalStorage() {
  const cartListStorage = localStorage.getItem('cartList');
  // Gets the value of the key 'cartList' from the local storage

  if (cartListStorage) cartItems.innerHTML = cartListStorage;
  // If the key 'cartList' exists (local storage), sets the value of the key 'cartList' in cartItems HTML
}

function createTotalPriceElement() {
  const cartSection = document.querySelector('.cart');

  const totalPrice = document.createElement('span');
  totalPrice.className = 'total-price';

  cartSection.appendChild(totalPrice);
}

function getTotalPrice() {
  let totalPrice = 0;
  const items = document.querySelectorAll('.cart__item');
  
  items.forEach((item) => {
    const itemText = item.innerText;
    const itemPrice = Number(itemText.substring(itemText.indexOf('$') + 1));
    // Gets only the price of the item and converts it to a number
    // Example: 'SKU: 12345 | NAME: Computer | PRICE: $1000'
    // Number(item.substring(item.indexOf('$') + 1)) => Number(item.substring(39 + 1)) => Number(1000) => 1000

    totalPrice += itemPrice;
  });

  return Math.round(totalPrice * 100) / 100;
}

function updateTotalPrice() {
  const totalPriceElement = document.querySelector('.total-price');
  const totalPrice = getTotalPrice();

  totalPriceElement.innerText = totalPrice;
}

function addToCart() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('item__add')) {
      const itemID = getSkuFromProductItem(event.target.parentNode);
      const { id, title, price } = await fetchItemID(itemID);
      const cartItemElement = createCartItemElement({ id, title, price });

      cartItems.appendChild(cartItemElement);

      saveToLocalStorage();
      updateTotalPrice();
    }
  });
}

function removeFromCart() {
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItems.removeChild(event.target);
      
      saveToLocalStorage();
      updateTotalPrice();
    }
  });
}

window.onload = () => {
  cartItems = document.querySelector('.cart__items');

  appendItems('computador');
  addToCart();
  removeFromCart();
  loadLocalStorage();
  createTotalPriceElement();
  updateTotalPrice();
};
