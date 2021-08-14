const items = document.querySelector('.items');

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

const addToCart = () => {
 items.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const item = event.target.parentNode;
  const itemId = item.querySelector('span.item__sku').innerText;

  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then(({ id: sku, title: name, price: salePrice }) => 
  createCartItemElement({ sku, name, salePrice }))
  .then((li) => document.querySelector('ol').appendChild(li));
 });
};

window.onload = () => {
  getProducts();
  addToCart();
  cartItemClickListener();
};