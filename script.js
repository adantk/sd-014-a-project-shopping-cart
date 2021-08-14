let totalStoraged;
let subTotal = 0;
let cartListItems;
let total;

function updateSubTotal(price) {
  subTotal += price;
  total.innerHTML = subTotal;
}

function cartStorage() {
  localStorage.setItem('cartStoraged', cartListItems.innerHTML);
  localStorage.setItem('totalStoraged', total.innerHTML);
}

function cartLoadStorage() {
  const cartStoraged = localStorage.getItem('cartStoraged');
  if (cartStoraged) cartListItems.innerHTML = cartStoraged;
  if (totalStoraged) total.innerHTML = totalStoraged;
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

async function cartItemClickListener(event) {
  if (event.target.className === 'cart__item' && event.target.parentElement !== null) {
    // source: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/split
    const priceExit = event.target.innerHTML.split('PRICE: $')[1];
    event.target.parentElement.removeChild(event.target);
    updateSubTotal(-priceExit);
    cartStorage();
  }
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

function pageLoad() { // Carrega a página inicial com a pesquisa por computador.
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json().then((dados) => {
      dados.results.forEach((result) => {
        const produto = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(produto));
      });
    }));
}

async function addToCart(event) {
  if (event.target.className === 'item__add') {
    const id = getSkuFromProductItem(event.target.parentElement);
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json()).then((dados) => {
        const produto = {
          sku: id,
          name: dados.title,
          salePrice: dados.price,
        };
        cartListItems.appendChild(createCartItemElement(produto));
        updateSubTotal(produto.salePrice);
        cartStorage();
      });
  }
}

function clearCart(event) {
  if (event.target.className === 'empty-cart') {
    cartListItems.innerHTML = '';
    total.innerHTML = '';
    cartStorage();
  }
}

window.onload = () => {
  pageLoad();
  totalStoraged = localStorage.getItem('totalStoraged');
  if (totalStoraged) subTotal = parseFloat(totalStoraged);
  total = document.querySelector('.total-price');
  cartListItems = document.querySelector('.cart__items');
  document.body.addEventListener('click', addToCart);
  document.body.addEventListener('click', cartItemClickListener);
  document.body.addEventListener('click', clearCart);
  cartLoadStorage();
};