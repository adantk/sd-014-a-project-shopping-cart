const cartItems = '.cart__items';

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

const cartSaved = () => {
  const itemsToSave = document.querySelector(cartItems);
  localStorage.setItem('cartItems', itemsToSave.innerHTML);
};

function cartItemClickListener(event) {
  const cartItem = document.querySelector(cartItems);
  cartItem.removeChild(event.target);
  cartSaved();
}

const loadCart = () => {
  const itemsSaved = document.querySelector(cartItems);
  const itemsToGet = localStorage.getItem('cartItems');
    if (itemsToGet) {
    itemsSaved.innerHTML = itemsToGet;  
    itemsSaved.childNodes.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
};

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
  const products = document.querySelector(cartItems);

  products.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));
  cartSaved();
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
  const itemsSection = document.querySelector('.items');
  const loadingSection = document.createElement('section');
  loadingSection.innerHTML = 'loading...';
  loadingSection.classList.add('loading');
  itemsSection.appendChild(loadingSection);
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const responseJson = await responseRaw.json();
  loadingSection.remove();

  const { results } = responseJson;
  const items = document.querySelector('.items');

  results.forEach(({ title, id, thumbnail }) => items.appendChild(createProductItemElement({
    name: title,
    sku: id,
    image: thumbnail,
  })));
  btnAddItem();
};

const erase = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    const cart = document.querySelector(cartItems);
    cart.innerHTML = '';
    cartSaved();
  });
};

window.onload = () => { 
  fetchComputers('computador');
  erase();
  loadCart();
};
