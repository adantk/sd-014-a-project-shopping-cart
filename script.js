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

const saveCart = () => {
  const cartI = document.querySelector('.ol_cart');
  localStorage.setItem('savedItens', cartI.innerHTML);
};

const sumOfPrices = () => { 
  let sum = 0;
  const cart = document.querySelectorAll('.cart__item');
  // console.log(cart);
  cart.forEach((item) => {
    const items = item.innerText;
    const textI = items.indexOf('$') + 1;
    const textLength = items.length;
    const number = Number(items.substr(textI, textLength));
    // Source: https://www.w3schools.com/jsref/jsref_number.asp
    // Soucer: https://www.w3schools.com/jsref/jsref_substr.asp
    // console.log(number);
    sum += number;
  });
  sum = Math.round(sum * 100) / 100;
  const p = document.querySelector('.total-price');
  p.innerHTML = sum;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  saveCart();
  sumOfPrices();
}

const restoreCart = () => {
  const cartI = document.querySelector('.ol_cart');
  cartI.innerHTML = localStorage.getItem('savedItens');
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
  sumOfPrices();
};

const emptyCart = () => {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', () => {
    const itens = document.querySelector('.ol_cart');
    itens.innerHTML = '';
    localStorage.clear();
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItem = async (item) => { 
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const responseJson = await responseRaw.json();
  const cartItens = document.querySelector('.cart__items');
  cartItens.appendChild(createCartItemElement({
    sku: responseJson.id,
    name: responseJson.title,
    salePrice: responseJson.price,
  }));
  saveCart();
  sumOfPrices();
};

const buttonAdd = () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      addCartItem(event.target.parentElement.firstChild.innerText);
    });
  });
};

const acessAPI = async (search) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
  const responseJson = await responseRaw.json();
  const { results } = responseJson;

  const itens = document.querySelector('.items');
  results.forEach(({ title, id, thumbnail }) => {
    itens.appendChild(createProductItemElement({
      name: title,
      sku: id,
      image: thumbnail,
    }));
  });
  buttonAdd();
};

window.onload = () => { 
  acessAPI('computer');
  restoreCart();
  emptyCart();
};
