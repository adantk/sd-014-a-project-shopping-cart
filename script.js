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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement(item) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${item.id} | NAME: ${item.title} | PRICE: $${item.price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getListPromisse = async (computador) => {
  const url = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const urlJson = await url.json();
  const arrArray = urlJson.results.map((element) => ({
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
  }));
  const items = document.querySelector('.items');
  arrArray.forEach((element) => items.appendChild(createProductItemElement(element)));
};

const addItemCar = async ({ target }) => {
  const itemId = getSkuFromProductItem(target.parentNode);
  const idURL = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const idURLJson = await idURL.json();
  const itemCar = document.querySelector('.cart__items');
  itemCar.appendChild(createCartItemElement(idURLJson));
};

const getButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', addItemCar));
};

window.onload = async () => { 
  await getListPromisse('computador');
  getButton(); 
};
