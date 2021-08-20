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

function createProductItemElement({
  sku,
  name,
  image
}) {
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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createLoad = () => {
  const createLoad = document.createElement('p');
  createLoad.className = 'loading';
  createLoad.innerText = 'loading...'
  document.body.appendChild(createLoad);
}

const removeLoad = () => document.body.removeChild(document.querySelector('.loading'));

const clearCart = () => {
  const clearBtn  = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.innerHTML = '';
  })
}


const getProducts = async () => {
  createLoad();
  const request = await fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador");
  const response = await request.json();
  const results = response.results;
  removeLoad();
  return results;

  console.log(results);
}

window.onload = () => {
  getProducts();
  clearCart();
};