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

function subtraiCart(product) {
  const total = document.getElementsByClassName('total-price')[0];
  const totalPrice = parseFloat((Number(total.innerText)).toFixed(2));
  const removed = parseFloat((Number(product.innerText.split('$')[1])).toFixed(2));

  total.innerText = `${totalPrice - removed}`;
  
  return total;
}

function savePage() {
  localStorage.setItem('cartItems', document.querySelector('#cart__items').innerHTML);
  localStorage.setItem('total', document.querySelector('#total-cart').innerHTML);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.getElementById('cart__items'); 
  event.remove();
  subtraiCart(event);
  savePage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event.target));
  return li;
}

function sumCart(event) {
  let total = 0;
  const sum = document.querySelector('#total-cart');
  const liCart = document.querySelectorAll('.cart__item');
  liCart.forEach((item) => {
    total += parseFloat((Number(item.innerText.split('PRICE: $')[1])).toFixed(2));
    sum.innerText = `${parseFloat((total).toFixed(2))}`;
  });
  savePage();
  return sum;
}

function addToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const cartObj = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('#cart__items').appendChild(createCartItemElement(cartObj));
          sumCart();
    });
});
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAdd = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  btnAdd.addEventListener('click', () => {
    const btnParent = btnAdd.parentElement;
  const productId = btnParent.firstChild.innerText;
  addToCart(productId);
  });
  section.appendChild(btnAdd);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addProducts() {
  const load = document.querySelector('.loading');
  load.innerText = 'Loading...';
  document.querySelector('.items').appendChild(load);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
      .then(document.querySelector('.items').removeChild(load))
        .then((data) => {
          data.results.map(((product) => document.querySelector('.items')
          .appendChild(createProductItemElement({
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
          }))));
        });
    });
}

function clearCart() {
  const cart = document.querySelector('.cart__items');
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    cart.innerHTML = '';
    document.querySelector('.total-price').innerText = '0';
    savePage();
  });
}

function loadSavedCart() {
  document.getElementById('cart__items').innerHTML = localStorage
  .getItem('cartItems');
  document.querySelector('.total-price').innerHTML = localStorage
  .getItem('total');
}

window.onload = () => { 
  addProducts();
  clearCart();
  loadSavedCart();
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', (event) => {
    // event.target.remove();
    cartItemClickListener(event.target);
    // sumCart(event.target);
    // subtraiCart(event.target);
  });
});
};
