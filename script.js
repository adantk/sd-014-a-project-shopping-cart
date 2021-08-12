const productsSection = document.querySelector('.items');
const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

function saveCart() {
  localStorage.setItem('savedCart', cartList.innerHTML);
  localStorage.setItem('savedPrice', totalPrice.innerText);
}

function loadCart() {
  const getCart = localStorage.getItem('savedCart');
  const getPrice = localStorage.getItem('savedPrice');
  if (getCart) cartList.innerHTML = getCart;
  if (getPrice) totalPrice.innerText = getPrice;
}
async function getProducts(search) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((res) => res.json())
    .then((res) => res.results);
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

function addTotal(price) {
  totalPrice.innerText = Math.round((Number(totalPrice.innerText) + price) * 100) / 100;
}

function subTotal(price) {
  totalPrice.innerText = Math.round((Number(totalPrice.innerText) - price) * 100) / 100;
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

function cartItemClickListener(e) {
  if (e.target.className === 'cart__item') {
    const price = Number(e.target.innerText.split('PRICE: $')[1]);
    e.target.parentElement.removeChild(e.target);
    subTotal(price);
    saveCart();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

async function displayProducts(search) {
  const products = await getProducts(search);
  await products.forEach((product) => {
    productsSection.appendChild(createProductItemElement(product));
  });
}

async function addToCart(e) {
  if (e.target.className === 'item__add') {
    const productId = getSkuFromProductItem(e.target.parentElement);
    const getProductInfo = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const productInfo = await getProductInfo.json();
    cartList.appendChild(createCartItemElement(productInfo));
    console.log(productInfo.price);
    addTotal(productInfo.price);
    saveCart();
  }
}

function clearCart(e) {
  if (e.target.className === 'empty-cart') {
    while (cartList.firstChild) cartList.removeChild(cartList.firstChild);
    totalPrice.innerText = 0;
    saveCart();
  }
}

window.onload = () => {
  displayProducts('computador');
  document.body.addEventListener('click', addToCart);
  document.body.addEventListener('click', cartItemClickListener);
  document.body.addEventListener('click', clearCart);
  loadCart();
};
