const items = document.querySelector('.items');
const btnEmpty = document.querySelector('.empty-cart');
const list = document.querySelector('.cart__items');
const pagCart = document.querySelector('.cart');

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

// Requisito 05 (SUBTRAINDO):
const subtracPrice = (request) => {
  const total = document.querySelector('.total-price');
  const arraySub = request.innerText.split('$'); 

  const result = total.innerText - arraySub[1];
  total.innerText = Math.round((result + Number.EPSILON) * 100) / 100;
};

// Requisito 03:
function cartItemClickListener(event) {
  event.target.classList.add('selected');
  const selected = document.querySelector('.selected');
  subtracPrice(selected);
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

// Requisito 05 (SOMANDO):
const arrayPrice = [];
const sumPrice = (request) => {
  const { price } = request;
  const total = document.querySelector('.total-price');
  arrayPrice.push(price);
  const sum = arrayPrice.reduce(((acc, cur) => acc + cur), 0);
  total.innerText = Math.round((sum + Number.EPSILON) * 100) / 100;
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
    requestFormat('/items/', productID, sumPrice);
  }));
};

// Requisito 6:
btnEmpty.addEventListener('click', () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
});

// Requisito 7:
const loadClean = () => items.removeChild(items.firstChild);

window.onload = async () => {
  await items.appendChild(createCustomElement('span', 'loading', 'loading...')); // Requisito 7
  await requestFormat('/sites/MLB/search?q=', 'computador', itemsToHTML);
  await pagCart.appendChild(createCustomElement('span', 'total-price', '0'));
  await loadClean();
  await btnClick();
};
