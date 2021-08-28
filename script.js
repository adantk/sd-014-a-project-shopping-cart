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

const addCartItems = async (idItem) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${idItem}`);
  const responseJson = await responseRaw.json();

  const { id, title, price } = responseJson;
  const products = document.querySelector('.cart__items');

  products.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));
};

const btnAddItem = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((button) => {
    button.addEventListener('click', (event) => {
      addCartItems(event.target.parentElement.firstChild.innerText);
    });
  });
};

const fetchComputers = async (computador) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const responseJson = await responseRaw.json();

  const { results } = responseJson;
  const items = document.querySelector('.items');

  results.forEach(({ title, id, thumbnail }) => items.appendChild(createProductItemElement({
    name: title,
    sku: id,
    image: thumbnail,
  })));
  btnAddItem();
};

window.onload = () => { 
  fetchComputers('computador');
};
