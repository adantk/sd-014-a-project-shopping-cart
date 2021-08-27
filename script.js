const ENDPOINTS = {
  computer: 'https://api.mercadolibre.com/sites/MBL/search?q=',
  item: 'https://api.mercadolibre.com/items',
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
const listaCarrinho = document.querySelector('.cart__items');
function clearList() {
  listaCarrinho.innerHTML = '';
  localStorage.setItem('store', JSON.stringify(listaCarrinho.innerHTML));
}
document.querySelector('.empty-cart').addEventListener('click', clearList);

function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    event.target.remove();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchdata(endpoint, query) {
  const api = `${endpoint}${query || ''}`;
  const response = await fetch(api);
  const data = await response.json();
  return data;
}
async function addProdutos(section) {
  const products = await fetchdata(ENDPOINTS.computer, 'computador')
  .then((data) => data.results);
  products.forEach(({ id: sku, title: name, thumbnail: image }) => {
  const product = createProductItemElement({ sku, name, image });
  section.appendChild(product);
});
}
 async function addCar(event) {
  if (event.target.classList.contains('item__add')) {
    const productId = getSkuFromProductItem(event.target.parentElement);
    const productInfo = await fetchdata(ENDPOINTS.item, productId)
    .then(({ title: name, price: salePrice }) => ( 
      { sku: productId, name, salePrice }
    ));
      const productElement = createCartItemElement(productInfo);
      listaCarrinho.appendChild(productElement);
      localStorage.setItem('store', JSON.stringify(listaCarrinho.innerHTML));
  }
}
listaCarrinho.addEventListener('click', cartItemClickListener);
async function loadPage() {
  const productSection = document.querySelector('.items');
  await addProdutos(productSection);
  productSection.addEventListener('click', addCar);
}
window.onload = () => { 
  loadPage();
  listaCarrinho.innerHTML = JSON.parse(localStorage.getItem('store'));
};
