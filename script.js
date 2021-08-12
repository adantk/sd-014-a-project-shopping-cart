const saveLocalStorage = (storageItem) => {
  const cartItems = storageItem.innerHTML;
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const setTotalPrice = () => {
  const cartItems = document.querySelectorAll('li');
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = 0;

  cartItems.forEach((current) => {
    const salePrice = parseFloat(current.innerText.split('$')[1]);

    totalPrice.innerHTML = parseFloat(totalPrice.innerHTML) + salePrice;
  });
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const cartItemClickListener = (event) => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  setTotalPrice();
  saveLocalStorage(cartItems);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadingEnd = () => {
  document.querySelector('.loading').remove();
};

const fetchAPIComputerURL = async () => {
  try {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const response = await fetch(url);
    const { results } = await response.json();

    return results;
  } catch (error404) {
    console.log('Não encontrei esta URL', error404);
  }
};

const renderProducts = (arr) => {
  const sectionItems = document.querySelector('.items');

  arr.map(({ id: sku, title: name, thumbnail: image }) => 
  sectionItems.appendChild(createProductItemElement({ sku, name, image })));
};

const fetchAPIItemsURL = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(url);
  const result = await response.json();

  return result;
};

const addCartItem = async (event, cartSection) => {
  const itemID = event.target.parentElement.firstChild.innerHTML;
  const itemData = await fetchAPIItemsURL(itemID);
  const { id: sku, title: name, price: salePrice } = itemData;

  cartSection.appendChild(createCartItemElement({ sku, name, salePrice }));
  setTotalPrice();
  saveLocalStorage(cartSection);
};

const removeAllCartItems = (cartSection) => {
  while (cartSection.firstChild) {
    cartSection.removeChild(cartSection.firstChild);
  }
  saveLocalStorage(cartSection);
  setTotalPrice();
};

const getLocalStorageItems = (cartItem) => {
  const localStorageItems = JSON.parse(localStorage.getItem('cartItems'));
  const cartSection = cartItem;
  cartSection.innerHTML = localStorageItems;
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach((current) => current.addEventListener('click', cartItemClickListener));
  setTotalPrice();
};

const addButtonEvent = (cartItem) => {
  const addButton = document.querySelectorAll('.item__add');

  addButton.forEach((current) => {
    current.addEventListener('click', (event) => addCartItem(event, cartItem));
  });
};

window.onload = async () => { 
  const cartSection = document.querySelector('.cart__items');
  const results = await fetchAPIComputerURL();
  const rmvItemsBtn = document.querySelector('.empty-cart');

  renderProducts(results);
  loadingEnd();
  addButtonEvent(cartSection);
  getLocalStorageItems(cartSection);
  rmvItemsBtn.addEventListener('click', () => removeAllCartItems(cartSection));
};
