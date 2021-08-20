const apiURL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const apiItensURL = 'https://api.mercadolibre.com/items/';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const element = event.target;
  element.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToCart(event) {
  const ol = document.querySelector('.cart__items');
  const skuID = getSkuFromProductItem(event.target.parentNode);
  const endpoint = `${apiItensURL}${skuID}`;
  const itemsResult = await (await fetch(endpoint)).json();
  const { id: sku, title: name, price: salePrice } = itemsResult;
  const result = createCartItemElement({ sku, name, salePrice });
  ol.appendChild(result);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addProductToCart);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  return section;
}

async function createProductList(element) {
  const itemsElements = document.querySelector('.items');
  const endpoint = `${apiURL}${element}`;
  const object = await (await fetch(endpoint)).json();
  const { results } = object;

  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const productItem = createProductItemElement({ sku, name, image });
    itemsElements.appendChild(productItem);
  });
}

window.onload = () => {
  createProductList('computador');
};
