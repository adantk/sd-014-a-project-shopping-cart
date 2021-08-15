const getOl = () => document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  // coloque seu código aqui
 getOl().removeChild(event.target);  
}

const makeAppend = (li) => {
  getOl().appendChild(li);
  localStorage.setItem('list', getOl.innerHTML);
};

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

const fetchProducts = async () => {
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
        responseJson.results.map(({ id, title, thumbnail }) =>
        createProduct(id, title, thumbnail));
        buttonListener(); 
 };

 const getItem = () => {
  if (localStorage.getItem('list') === null) {
    localStorage.getItem('list', JSON.stringify([]));
  } else {
    const listProducts = localStorage.getItem('list');
    getOl().innerHTML = listProducts;
  }
};

window.onload = () => {
 fetchProducts();
 
  getItem();
}; 
