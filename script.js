const cartItemsOl = document.querySelector('.cart__items');
const cart = document.querySelector('.cart');
const totalPriceElement = document.querySelector('.total-price');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function storageCartItem() {
  localStorage.setItem('cartItems', cartItemsOl.innerHTML);
}

function storageTotalPrice() {
  localStorage.setItem('totalPrice', totalPriceElement.innerText);
}

function priceCounter() {
  let totalPrice = 0;
  [...cartItemsOl.children].forEach((product) => {
    let productPrice = product.innerText.split('$')[1];
    productPrice = parseFloat(productPrice);
    totalPrice += productPrice;
  });

  totalPrice = totalPrice.toFixed(2);
  totalPrice = parseFloat(totalPrice);

  cart.lastElementChild.innerText = totalPrice;
  storageTotalPrice();
}

function cartItemClickListener(event) {
  cartItemsOl.removeChild(event.target);
  storageCartItem();
  priceCounter();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItemsOl.appendChild(li);
  storageCartItem();
  priceCounter();
}

function addToCartEvent(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
      .then(({ id: sku, title: name, price: salePrice }) =>
      createCartItemElement({ sku, name, salePrice }));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => addToCartEvent(event));

  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(section);
}

const productSearch = (query) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
      .then((response) => response.json())
        .then((dados) => dados.results.forEach(
          ({ id: sku, title: name, thumbnail: image }) => 
          createProductItemElement({ sku, name, image }),
)); 
};

function restoreLocalStorage() {
  if (localStorage.length > 0) {
  totalPriceElement.innerText = localStorage.getItem('totalPrice');
  cartItemsOl.innerHTML = localStorage.getItem('cartItems');
  [...cartItemsOl.children].forEach((li) => li.addEventListener('click', cartItemClickListener));
}
}

window.onload = () => {
  productSearch('computador');
  restoreLocalStorage();
};
