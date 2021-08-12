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

// Requisito #1
const addItems = async () => {
  const response = await (await fetch(API_URL)).json();
  const results = response.results;
  
  results.forEach((result) => {
    const info = { sku: result.id, name: result.title, image: result.thumbnail };
    const product = createProductItemElement(info);
    document.querySelector('.items').appendChild(product);
  });
};

// Requisito #2

// const verifiedFetch = async (url) => {
//   if (url === API_URL) {
//     return fetch(API_URL)
//       .then((response) => response.json())
//       .then((response) => response.results);
//   }
//   throw new Error('Endpoint não existe');
// }

// const addItem = async () => {
//   try {
//     const results = await verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
//     results.forEach(({ id: sku, title: name, thumbnail: image }) => {
//       const product = createProductItemElement({ sku, name, image });
//       document.querySelector('.items').appendChild(product);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  addItems();
};
