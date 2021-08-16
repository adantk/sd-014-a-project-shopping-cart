const URL_1 = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const URL_2 = 'https://api.mercadolibre.com/items/';

function totalPriceCart() {
  const totalPriceElement = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += Number(item.id);
  });
  totalPriceElement.innerText = totalPrice;
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

function actualizeLocalStorage() {
  const items = document.querySelector('ol');
  localStorage.setItem('cartItems', items.innerHTML);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  totalPriceCart();
  actualizeLocalStorage();
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

function cleanCart() {
  const items = document.querySelector('ol');
  items.innerHTML = '';
  actualizeLocalStorage();
  totalPriceCart();
}

function appendProducts(response) {
  const listOfCart = document.querySelector('.cart__items');
  const infosOfProduct = {
    sku: response.id,
    name: response.title,
    salePrice: response.price,
  };
  const itemCart = createCartItemElement(infosOfProduct);
  itemCart.id = response.price;
  listOfCart.appendChild(itemCart);
  actualizeLocalStorage();
}

function appendProductsOnCart() {
  const buttonsAddToCart = document.querySelectorAll('.item__add');
  buttonsAddToCart.forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      fetch(`${URL_2}${itemID}`)
        .then((response) => response.json())
        .then((product) => { appendProducts(product); }).then(() => { totalPriceCart(); });
    });
  });
}

function appendProductsOnList(products) {
  const items = document.querySelector('.items');
  items.innerHTML = '';
  products.forEach((product) => {
    const infosOfProduct = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    items.appendChild(createProductItemElement(infosOfProduct));
  });
}

function emptyCartButton() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', cleanCart);
}

function loadingElement() {
  const items = document.querySelector('.items');
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  items.appendChild(loading);
}

async function process(item = 'computador') {
  try {
    loadingElement();
    emptyCartButton();
    const fetchMercadoLivre = await fetch(`${URL_1}${item}`);
    const mercadoLivreJSON = await fetchMercadoLivre.json();
    const products = mercadoLivreJSON.results;
    appendProductsOnList(products);
    appendProductsOnCart();
  } catch (error) {
    console.log('Deu ruim!!');
  }
}

function addSavedLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('cartItems');
  cartItems.addEventListener('click', cartItemClickListener);
  totalPriceCart();
}

window.onload = () => {
  addSavedLocalStorage();
  process();
};