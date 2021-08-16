const items = document.querySelector('.items');

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

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// Preparation:
const URL = 'https://api.mercadolibre.com';

const requestFormat = async (type, item) => {
  const url = await fetch(URL + type + item);
  const urlData = await url.json();
  return urlData;
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
const btnClick = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((b) => b.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstChild.innerText;
    return requestFormat('/items/', productID);
  }));
};

// -------------------------------------------------------------
window.onload = async () => {
  const fetchAPI = await requestFormat('/sites/MLB/search?q=', 'computador');
  await itemsToHTML(fetchAPI);
  await btnClick();
};
