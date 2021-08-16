const items = document.querySelector('.items');
const olCartList = document.querySelector('ol');

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

function cartItemClickListener() {
  // coloque seu código aqui
  document.querySelector('ol').addEventListener('click', (event) => {
    event.target.remove();
    localStorage.setItem('myCartList', olCartList.innerHTML);
  });  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const getProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer')
    .then((response) => response.json())
    .then((result) => result.results)
    .then((data) => {
      data.map(({ id: sku, title: name, thumbnail: image }) =>
        items.appendChild(createProductItemElement({ sku, name, image })));
    })
    .catch((error) => console.log('erro!', error));
};

const fetchItemById = async (itemId) => {
  const myFetch = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const response = await myFetch.json();
  return response;
};

const addToCart = () => {
 items.addEventListener('click', async function createElement(event) {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }
    const item = event.target.parentNode;
    const itemId = item.querySelector('span.item__sku').innerText;
    const fetchItem = await fetchItemById(itemId);
    const createElementById = ({ id: sku, title: name, price: salePrice }) => {
      olCartList.appendChild(createCartItemElement({ sku, name, salePrice }));
    };
    createElementById(fetchItem);
    localStorage.setItem('myCartList', olCartList.innerHTML);
  });
};

const loadCartItems = () => {
  olCartList.innerHTML = localStorage.getItem('myCartList');
};

window.onload = () => {
  getProducts(); 
  addToCart();
  cartItemClickListener();
  loadCartItems();
};