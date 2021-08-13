const cartItemsClass = '.cart__items';

const loadCartFromStorage = () => {
  const cart = document.querySelector(cartItemsClass);
  const cartLocalStorage = localStorage.getItem('cartList');
  cart.innerHTML = (cartLocalStorage);
  Array.from(cart.children).forEach((item) => 
    item.addEventListener('click', cartItemClickListener));
    /** Consultei o repositório do Gustavo Dias para resolver essa parte final com 'cart.children'
    * Link: https://github.com/tryber/sd-014-a-project-shopping-cart/tree/gustavo-dias-project-shopping-cart
    */ 
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function getSkuFromProductItem(item) {
  const addButton = await item.target.parentNode;
  return addButton.querySelector('span.item__sku').innerText;
}

const fetchRequestEndpoint = async (idProduct) => {
  return fetch(`https://api.mercadolibre.com/items/${idProduct}`)
   .then((response) => response.json());
};

async function cartItemClickListener(event) {
  const cart = document.querySelector(cartItemsClass);
  event.target.remove();
  localStorage.setItem('cartList', cart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event) => {
  const idProductAdd = await getSkuFromProductItem(event);
  const returnEndPoint = await fetchRequestEndpoint(idProductAdd);
  const { id, title, price } = await returnEndPoint;
  const cart = document.querySelector(cartItemsClass);
  cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  saveToLocalStorage(cart);
};

const saveToLocalStorage = (cart) => { 
  localStorage.setItem('cartList', cart.innerHTML)
};

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
  section.addEventListener('click', addItemToCart);
  return section;
}

const fetchProduct = async (search) => {
 const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
 const responseJson = await responseRaw.json();
 return responseJson.results;
};

const loadElements = async (search) => {
  const result = await fetchProduct(search);
  result.forEach(({ id, title, thumbnail }) => document.querySelector('.items')
    .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
    
};

window.onload = () => {
  loadElements('computador');
  loadCartFromStorage();
}