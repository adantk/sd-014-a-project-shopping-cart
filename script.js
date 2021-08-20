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
  if (element === 'button') {
    e.addEventListener('click', addItemOnCart);
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, image }) {
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
  const wishList = (event.target).parentNode;
  wishList.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemOnCart(event) {
  const ItemID = (((event.target).parentNode).firstChild.innerText);
  const cartList = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((data) => data.json())
  .then((product) => cartList.appendChild(createCartItemElement(product)));
}

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((data) => data.json())
  .then(({ results }) => results.forEach((obj) => {
    document.querySelector('.items').appendChild(createProductItemElement(obj));
  }));
};