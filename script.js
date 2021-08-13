const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Requisito 3
function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event) => {
  const id = event.target.parentElement.firstElementChild.innerText;
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await response.json();
  const info = { sku: item.id, name: item.title, salePrice: item.price };
  const newLi = createCartItemElement(info);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(newLi);
};

// Requisito #1
const addItems = async () => {
  const response = await (await fetch(API_URL)).json();
  const { results } = response;
  
  results.forEach((result) => {
    const info = { sku: result.id, name: result.title, image: result.thumbnail };
    const product = createProductItemElement(info);
    document.querySelector('.items').appendChild(product);
  });

  // Requisito #2
  const btns = Object.values(document.querySelectorAll('.item__add'));
  btns.forEach((btn) => {
    btn.addEventListener('click', addItemToCart);
  });
};

window.onload = () => {
  addItems();
};
