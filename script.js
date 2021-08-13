const myCart = document.querySelector('.cart__items');

const saveMyCart = () => {
  localStorage.clear();
  localStorage.setItem('myCartListStorage', myCart.innerHTML);
};

const loadMyCart = () => {
  myCart.innerHTML = localStorage.getItem('myCartListStorage');
  const cartContent = document.querySelectorAll('.cart__item');
  cartContent.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  event.target.remove();
  saveMyCart();
  sumPrices();
}

const addMySearch = (resultados) => {
  const myContainer = document.querySelector('.items');
  resultados.forEach((item) => myContainer.appendChild(createProductItemElement(item)));
}

const getMercadoList = async (query) => {
  const myLoadingEvent = document.getElementById('loading');
  myLoadingEvent.innerText = 'loading...';
  const myEndPoint = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const myInfo = await myEndPoint.json();
  myLoadingEvent.remove();
  addMySearch(myInfo.results);
}

const addToMyCart = (product) => {
  document.querySelector('.cart__items').appendChild(createCartItemElement(product));
  saveMyCart();
  sumPrices();
}

const getMercadoItem = async ({ target }) => {
  const myItemID = getSkuFromProductItem(target.parentNode);
  const myResponse = await fetch(`https://api.mercadolibre.com/items/${myItemID}`);
  const myInfo = await myResponse.json();
  addToMyCart(myInfo);
}

const addToCartButtons = () => {
  const myButtons = document.querySelectorAll('.item__add');
  myButtons.forEach((btAdd) => {
    btAdd.addEventListener('click', getMercadoItem);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item list-ml';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function sumPrices () {
  const cartItem = document.querySelectorAll('.list-ml');
  let totalSum = 0;
  cartItem.forEach((item) => {
    const myPrice = (item.innerText).split('$')[1];
    totalSum += parseFloat(myPrice);
    })
  document.getElementById('total-price').innerText = totalSum;
}

document.getElementById('empty-cart').addEventListener('click', () => {
  myCart.innerText = '';
  localStorage.clear();
});

window.onload = async () => {

  await getMercadoList('computador')
  .then(loadMyCart())
  .then(sumPrices());
  addToCartButtons();

};

