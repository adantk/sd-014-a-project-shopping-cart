const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const itemUrl = 'https://api.mercadolibre.com/items/';
const getCartList = () => document.querySelector('.cart__items');

// const loading = async () => {
//   const loadingDiv = await document.createElement('h1');
//   loadingDiv.className = 'loading';
//   loadingDiv.innerText = 'loading...';
//   document.querySelector('.items').appendChild(loadingDiv);
// };

const loaded = () => document.querySelector('.loading').remove();

const totalPrice = async () => {
  let total = 0;
  const cartItems = [...document.querySelectorAll('.cart__item')]; 
  const catItemsMap = cartItems.map((itemsList) => parseFloat(itemsList.innerText.split('$')[1]));
  total = catItemsMap.reduce((acc, current) => acc + current, 0);
  document.querySelector('.total-price').innerText = total;
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const eventClick = event.target.parentNode.removeChild(event.target);
  totalPrice();
  return eventClick;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCart = async (event) => {
  const clickk = event.target.parentNode;
  const itemID = getSkuFromProductItem(clickk);
  await fetch(`${itemUrl}${itemID}`)
    .then((response) => response.json())
    .then((itemData) => {
      const { id: sku, title: name, price: salePrice } = itemData;
      
      getCartList().appendChild(createCartItemElement({ sku, name, salePrice }));
      localStorage.setItem('cartt', getCartList().innerHTML);
      totalPrice();
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
      section.addEventListener('click', addCart); // Ja cria com um event listener
  return section;
}

function fetchMercadoAPI(product) {
  const itemClass = document.querySelector('.items');
  fetch(`${url}${product}`).then((response) => {
    loaded()
    response.json().then((dataML) => {
      dataML.results.forEach((resultsML) => {
        const { id: sku, title: name, thumbnail: image } = resultsML;
        itemClass.appendChild(createProductItemElement({ sku, name, image }));
      });
    });
  })
}

const loadLocalStorage = () => {
  getCartList().innerHTML = localStorage.getItem('cartt');
};
// https://www.w3schools.com/jsref/met_storage_setitem.asp
// https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/getItem

function emptyCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  totalPrice();
  localStorage.clear();
}

const emptyCartButton = () => { 
  const emptyCartButtonTwo = document.querySelector('.empty-cart');
  emptyCartButtonTwo.addEventListener('click', emptyCart);
};

window.onload = async () => {
  // loading();
  await fetchMercadoAPI('computador');
  // setTimeout( function() { fetchMercadoAPI('computador')}, 1000)
  await loadLocalStorage();
  await totalPrice();
  await emptyCartButton();
};
