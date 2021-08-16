const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_ITEM = 'https://api.mercadolibre.com/items/';
const itemsContainer = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const emptyCart = document.querySelector('.empty-cart');

const loading = document.createElement('div');
loading.className = 'loading';
loading.innerText = 'loading...';

const updatePrice = (price) => {
  totalPrice.innerText = parseFloat(totalPrice.innerText, 10) + price;
};

const saveCart = () => {
  localStorage.setItem('savedCart', cartItems.innerHTML);
  localStorage.setItem('totalPrice', totalPrice.innerText);
};

const loadCart = () => {
  const savedCart = localStorage.getItem('savedCart');
  if (savedCart) {
    cartItems.innerHTML = savedCart;
    totalPrice.innerText = localStorage.getItem('totalPrice');
  }
};

const clearCart = () => {
  cartItems.innerHTML = '';
  totalPrice.innerText = 0;
  saveCart();
};

const toggleLoading = () => {
    if (document.body.lastChild === loading) {
      document.body.removeChild(loading);
    } else {
      document.body.appendChild(loading);
    }
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
    updatePrice(-price);
    cartItems.removeChild(item);
    saveCart();
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

const fetchItems = async () => {
  toggleLoading();
  try {
    const { results } = await fetchAPI(API_URL);
    results.forEach((item) => { itemsContainer.appendChild(createProductItemElement(item)); });
  } catch (error) {
    console.log(error);
  }
  toggleLoading();
};

const addItemsToCart = async (event) => {
    const addButton = event.target;
    if (addButton.className === 'item__add') {
      const itemId = getSkuFromProductItem(addButton.parentElement);
      toggleLoading();
      try {
        const itemInfo = await fetchAPI(API_ITEM + itemId);
        cartItems.appendChild(createCartItemElement(itemInfo));
        updatePrice(itemInfo.price);
        saveCart();
      } catch (error) {
        console.log('Error:', error);
      }
      toggleLoading();
    }
  };

window.onload = () => {
  fetchItems();
  loadCart();
};

itemsContainer.addEventListener('click', addItemsToCart);
cartItems.addEventListener('click', cartItemClickListener);
emptyCart.addEventListener('click', clearCart);
