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
  const total = document.querySelector('.total-price');
  const totalPrice = Number(total.innerText);
  const removed = Number(product.innerText.split('$')[1]);

  total.innerText = `${totalPrice - removed}`;
  
  return total;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.getElementById('cart__items'); 
  cart.removeChild(event);
  subtraiCart(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event.target));
  return li;
}

function sumCart(price) {
  let total = 0;
  const sum = document.querySelector('.total-price');
  const liCart = document.querySelectorAll('.cart__item');
  liCart.forEach((item) => {
    total += Number(item.innerText.split('PRICE: $')[1]);
    sum.innerText = `${total}`;
  });
  
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
          document.querySelector('.cart__items').appendChild(createCartItemElement(cartObj));
          sumCart(cartObj.salePrice);
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
    document.querySelector('#total').innerText = 'Total: $0';
  });
}

window.onload = () => { 
  addProducts();
  clearCart();
};
