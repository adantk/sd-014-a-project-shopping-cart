const itemSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

// O próprio VS Code sugeriu e transformou as funções em async
const fetchProducts = async (query) => {
  const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const data = await resp.json();
  return data.results;
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const fetchProduct = async (idSku) => {
//   const resp = await fetch(`https://api.mercadolibre.com/items/${idSku}`);
//   const data = await resp.json();
//    createCartItemElement(data);
// };
// Havia feito o fetch separado, mas não consegui trabalhar com ele direito
const addToCart = () => {
  itemSection.addEventListener('click', async (event) => {
    if (event.target.classList.contains('item__add')) {
      const idSku = event.target.parentElement.firstChild.innerText;
      const resp = await fetch(`https://api.mercadolibre.com/items/${idSku}`);
      const data = await resp.json();
      return cartItems.appendChild(createCartItemElement(data));
    }
  });
};

window.onload = () => {
  fetchProducts('computador')
  .then((results) => results.forEach((result) => {
    itemSection.appendChild(createProductItemElement(result));
  }));
  // fetchProduct();
  addToCart();
};