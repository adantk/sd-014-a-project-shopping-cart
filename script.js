const items = document.querySelector('.items');
const btnEmpty = document.querySelector('.empty-cart');
const list = document.querySelector('.cart__items');

// Dadas Funções para o projeto:
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

// Requisito 03:
function cartItemClickListener(event) {
  event.target.classList.add('selected');
  const selected = document.querySelector('.selected');
  list.removeChild(selected);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Preparation:
const URL = 'https://api.mercadolibre.com';
const requestFormat = async (type, item, callback) => {
  const url = await fetch(URL + type + item);
  const urlData = await url.json();
  return (!callback) ? (urlData) : (callback(urlData));
};

// Requisito 01:
const itemsToHTML = (request) => {
  const { results } = request;
  results.forEach((data) => {
    const c = createProductItemElement({ sku: data.id, name: data.title, image: data.thumbnail });
    items.appendChild(c);
  });
};

// Requisitor 02:
const itemsToCart = (request) => {
  const { id, title, price } = request;
  const c = createCartItemElement({ sku: id, name: title, salePrice: price });
  list.appendChild(c);
};

const btnClick = () => {
  const btn = document.querySelectorAll('.item__add');

  btn.forEach((b) => b.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstChild.innerText;
    requestFormat('/items/', productID, itemsToCart);
  }));
};

// Requisito 6:
btnEmpty.addEventListener('click', () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
});

window.onload = async () => {
  await requestFormat('/sites/MLB/search?q=', 'computador', itemsToHTML);
  await btnClick();
};