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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPIComputerURL = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(url);
  const { results } = await response.json();

  return results;
};

const renderProducts = (arr) => {
  const sectionItems = document.querySelector('.items');

  arr.map(({ id: sku, title: name, thumbnail: image }) => 
  sectionItems.appendChild(createProductItemElement({ sku, name, image })));
};

const fetchAPIItemsURL = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(url);
  const result = await response.json();

  return result;
};

const addCartItem = async (event, cartSection) => {
  const itemID = event.target.parentElement.firstChild.innerHTML;
  const itemData = await fetchAPIItemsURL(itemID);
  const { id: sku, title: name, price: salePrice } = itemData;

  cartSection.appendChild(createCartItemElement({ sku, name, salePrice }));
};

const addButtonEvent = (cartItem) => {
  const addButton = document.querySelectorAll('.item__add');

  addButton.forEach((current) => {
    current.addEventListener('click', (event) => addCartItem(event,cartItem));
  });
};

window.onload = async () => { 
  const cartSection = document.querySelector('.cart__items')
  const results = await fetchAPIComputerURL();

  renderProducts(results);
  addButtonEvent(cartSection);
};
