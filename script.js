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
async function fetchComputers() {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resp = await api.json();
  const result = resp.results;
  result.forEach((element) => {
  document.querySelector('.items').appendChild(createProductItemElement(element));
 });
}
async function fetchProduct(id) {
  const apiResult = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respToJson = await apiResult.json();
  return respToJson;
}
   const cart = document.querySelector('.cart__items');
   async function addToCart() {
   await fetchComputers();
   const eventAdd = document.querySelectorAll('.item__add');
   eventAdd.forEach((item) => item.addEventListener('click', async (event) => {
   const itemID = getSkuFromProductItem(event.target.parentElement);
   const productInfo = await fetchProduct(itemID);
   // const productToJson = await productInfo.json();
   const createdProduct = createCartItemElement(productInfo);
    cart.appendChild(createdProduct);
  }));
}
window.onload = () => {
  fetchComputers();
  addToCart();
};
