let cartItems;
let totalCart;

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

// req 5
function cartSum() {
  const productsLi = document.querySelectorAll('.cart__item');
  let sumTotal = 0;
  productsLi.forEach((product) => {
    sumTotal += Number(product.innerHTML.split('$')[1]);
  });
  sumTotal = Math.round(sumTotal * 100) / 100;
  return sumTotal;
}
// end req 5

// req 3
function cartItemClickListener(clickDelete) {
  // coloque seu código aqui
  document.querySelector('.cart__items').removeChild(clickDelete.target);
  localStorage.setItem('localStorageItems', cartItems.innerHTML);
  totalCart.innerText = cartSum();
}
// end req 3

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  totalCart.innerText = cartSum();
  return li;
}

//  req 2
const addToCart = (ItemId) => {
  fetch(`https://api.mercadolibre.com/items/${ItemId}`)
    .then((results) => {
      results.json()
        .then((result) => {
          const {
            id: sku,
            title: name,
            price: salePrice,
          } = result;
          const cartSection = document.querySelector('.cart__items');
          cartSection.appendChild(createCartItemElement({
            sku, name, salePrice,
          }));
          localStorage.setItem('localStorageItems', cartItems.innerHTML);
          totalCart.innerText = cartSum();
        });
    });
};

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => { addToCart(sku); });

  section.appendChild(button);

  return section;
}
// end req 2

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addProductList = (products) => { // Adicionando cada item a section
  products.forEach((product) => {
    const element = createProductItemElement(product);
    const sectionList = document.querySelector('.items');
    sectionList.appendChild(element);
  });
};

//  req 1
const fetchInit = async () => {
  const getData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer');
  const data = await getData.json();
  data.results.forEach((result) =>
    document.querySelector('.items').appendChild(createProductItemElement(result)));
};
// end req 1

function loadCart() {
  const getCart = localStorage.getItem('localStorageItems');
  if (getCart) cartItems.innerHTML = getCart;
  totalCart.innerText = cartSum();
}

// req 4
function addEvents() {
  const liElements = document.querySelectorAll('li');
  liElements.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}
// end req 4

window.onload = () => {
  totalCart = document.querySelector('.total-price');
  cartItems = document.querySelector('ol');
  fetchInit();
  loadCart();
  addEvents();
  totalCart.innerText = cartSum();
};
