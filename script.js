const items = {
  list: document.querySelector('.items'),
  cart: document.querySelector('.cart__items'),
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

function createProductItemElement({
  sku,
  name,
  image,
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
  const cartItem = event.target.parentElement;
  cartItem.removeChild(event.target);
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createLoad = () => {
  const createLoading = document.createElement('p');
  createLoading.className = 'loading';
  createLoading.innerText = 'loading...';
  items.list.appendChild(createLoading);
};

const removeLoad = () => items.list.removeChild(document.querySelector('.loading'));

const getProducts = async () => {
  createLoad();
  const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await request.json();
  removeLoad();
  response.results.forEach((item) => {
    const itemDetails = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    items.list.appendChild(createProductItemElement(itemDetails));
  });
};

const addCart = () => {
  items.list.addEventListener('click', async (event) => {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    const request2 = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const response2 = await request2.json();
    const cartDetails = {
      sku: response2.id,
      name: response2.title,
      salePrice: response2.price.toFixed(2),
    };
    items.cart.appendChild(createCartItemElement(cartDetails));
  });
};

const clearCart = () => {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    items.cart.innerHTML = '';
  });
};

window.onload = () => {
  getProducts();
  addCart();
  clearCart();
};