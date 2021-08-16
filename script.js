const getOl = () => document.querySelector('.cart__items');
const getLi = () => Array.from(document.querySelectorAll('.cart__item'));
const getCartPrice = () => document.querySelector('.total-price');

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

const createProduct = (sku, name, image) =>
 document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));

 function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumTotalPrice = () => {
  const cartList = getLi().map((item) => item.innerText);
  const priceList = cartList.map((string) => string.split('PRICE: $')[1]);
  const totalValue = priceList.reduce((acc, sum) => acc + parseFloat(sum), 0);
  getCartPrice().innerText = Math.round(totalValue * 100) / 100;
 };
 
const subTotalPrice = (event) => {
  const itemSelected = event.target.innerText;
  const itemValue = itemSelected.split('PRICE: $')[1];
  const newValue = getCartPrice().innerText - itemValue;
  getCartPrice().innerHTML = Math.round(newValue * 100) / 100;
};  

function cartItemClickListener(event) {
  // coloque seu código aqui
  getOl().removeChild(event.target); 
  subTotalPrice(event); 
}

const makeAppend = (li) => {
  getOl().appendChild(li);
  localStorage.setItem('list', getOl().innerHTML);
  localStorage.setItem('price', getCartPrice().innerHTML);
  sumTotalPrice();
};

// Função que cria os elementos no carrinho de compras, remove os elementos e coloca os elementos no local storage logo depois de criados.

 function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  li.addEventListener('click', cartItemClickListener);

  makeAppend(li); 

  return li;
}

const fetchItem = async (itemId) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const responseJson = await responseRaw.json();
    const { id, title, price } = responseJson;
    createCartItemElement({ sku: id, name: title, salePrice: price });
};

const buttonListener = () => {
  const getButton = document.querySelector('.items');

   getButton.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
    const getId = getSkuFromProductItem(event.target.parentNode);
    fetchItem(getId);
    }
  });
};

const getItemLocalStorage = () => {
  if (localStorage.getItem('list') === null) {
    localStorage.getItem('list', JSON.stringify([]));
  } else {
    const listProducts = localStorage.getItem('list');
    const price = localStorage.getItem('price');
    getOl().innerHTML = listProducts;
    getCartPrice().innerHTML = price;
  }
};

const loadingMessage = () => {
  const body = document.querySelector('body');
  const message = document.createElement('div');
  message.className = 'loading';
  message.innerText = 'loading...';
  body.appendChild(message);
};

const deleteMessage = () => {
  const getMessage = document.querySelector('.loading');
  const body = document.querySelector('body');
  body.removeChild(getMessage);
};

const fetchProducts = async () => {
  try {
  loadingMessage();
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  if (responseRaw) {
  deleteMessage();  
  const responseJson = await responseRaw.json();
      responseJson.results.map(({ id, title, thumbnail }) =>
      createProduct(id, title, thumbnail));
  }
  } catch (error) {
    console.log(error);
  }
 };

 const clearCart = () => {
   const getClearButton = document.querySelector('.empty-cart');
   getClearButton.addEventListener('click', () => {
      getLi().forEach((item) => item.remove());
      localStorage.clear();
      getCartPrice().innerText = '0';
   });
 };

window.onload = () => {
 fetchProducts();
 getItemLocalStorage();

 getLi().forEach((item) => item.addEventListener('click', cartItemClickListener));

 buttonListener();
 clearCart();  
}; 
