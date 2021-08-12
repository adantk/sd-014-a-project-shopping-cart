const url = 'https://api.mercadolibre.com/sites/MLB/';
const urlItem = 'https://api.mercadolibre.com/items/';

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
  const img = image;
  img[(img.length - 5)] = 'L';
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

async function searchItem(item) {
  const response = await (await fetch(`${urlItem}${item}`))
  .json();
  return response;
}

async function searchProduct() {
  const response = await fetch(`${url}search?q=computer`).then((r) => r.json());
  return response;
}

async function adcEventsInButtons() {
  const button = document.querySelectorAll('.item__add');
  console.log(button);
  button.forEach((elem) => elem.addEventListener('click', async (event) => {
    const cart = document.querySelector('.cart__items');
    const id = event.target.parentElement.firstChild.innerText;
    const search = await searchItem(id);
    console.log(search);
    cart.appendChild(createCartItemElement(search));
  }));
}

function adcRemoveEvent() {
  const sectionsCart = document.querySelectorAll('.cart__item');
  sectionsCart.addEventListener('click', cartItemClickListener);
}

window.onload = async () => {
  const search = await searchProduct();
  const item = document.querySelector('.items');
  await search.results.forEach((element) => {
    item.appendChild(createProductItemElement(element));
  });
  await adcEventsInButtons();
 };
