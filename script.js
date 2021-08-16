function totalPrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  let total = 0;
  cartItems.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}

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
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}  

function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
  });
}

const addToCart = async (event) => {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(url);
    const { id, title, price } = await response.json();
    const li = createCartItemElement({ sku: id, name: title, salePrice: price });
    document.getElementsByClassName('cart__items')[0].appendChild(li);
  } catch (err) {
    console.log(err);
  }
  totalPrice();
};

const fetchApi = () => {
  const loading = document.querySelector('.loading');
  const items = document.getElementsByClassName('items')[0];
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then(({ results }) => results)
    .then((respArr) =>
      respArr.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        items.appendChild(item);
        item.addEventListener('click', addToCart);
        loading.remove();
      }))
    .catch((err) => console.log(err));
};

window.onload = () => { 
  fetchApi();
  emptyCart();
  totalPrice();
};
