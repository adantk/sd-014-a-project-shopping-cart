const productsSection = document.querySelector('.items');
const cartList = document.querySelector('.cart__items');

async function getProducts(search) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((res) => res.json())
    .then((res) => res.results);
}

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function displayProducts(search) {
  const products = await getProducts(search);
  await products.forEach((product) => {
    productsSection.appendChild(createProductItemElement(product));
  });
}

async function addToCart(e) {
  if (e.target.className === 'item__add') {
    let productInfo = await fetch(`https://api.mercadolibre.com/items/${this.e}`);
    productInfo = productInfo.json();
    cartList.appendChild(createCartItemElement(productInfo));    
  }
}

window.onload = () => {
  displayProducts('computador');
  document.body.addEventListener('click', addToCart);
};
