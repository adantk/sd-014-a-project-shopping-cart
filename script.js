const cartItems = '.cart__items';

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
  const sectionItems = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sectionItems.appendChild(section);
  return section;
}

// Requisito 5
const totalPriceFunction = () => {
  let sumCart = 0;
  const totalPrice = document.querySelector('.total-price');
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => {
    const price = item.innerText.split('$')[1];
    // console.log(price);
    sumCart += parseFloat(price);
    // console.log(sumCart);
  });
  totalPrice.innerText = sumCart;
  // console.log(totalPrice);
}; 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split

// Requisito 4 - pt 1
const localStorageSave = () => {
  localStorage.clear();
  const storageCart = document.querySelector(cartItems);
  localStorage.setItem('cart', storageCart.innerHTML);
  totalPriceFunction();
};

// Requisito 6
const emptyCartBtn = () => {
  const emptyCart = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  emptyCart.addEventListener('click', () => {
    ol.innerHTML = '';
    localStorageSave();
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  localStorageSave();
  totalPriceFunction();
}

// Requisito 4 - pt 2
const localStorageLoad = () => {
  const storageCart = document.querySelector(cartItems);
  storageCart.innerHTML = localStorage.getItem('cart');
  storageCart.addEventListener('click', cartItemClickListener);
  localStorageSave();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector(cartItems);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

// Requisito 7 - pt 1
const addLoadingText = () => {
  const loading = document.querySelector('.loading');
  loading.innerHTML = 'loading...';
};
// Requisito 7 - pt2
const rmLoadingText = () => {
  const rmLoading = document.querySelector('.loading');
  rmLoading.remove();
};

// Requisito 2 - pt1
const addCart = async (productId) => {
  const productSearch = await fetch((`https://api.mercadolibre.com/items/${productId}`));
  const pSJson = await productSearch.json();
  createCartItemElement({ sku: pSJson.id, name: pSJson.title, salePrice: pSJson.price });
  localStorageSave();
  totalPriceFunction();
};

// Requisito 2 - pt2
const addCartBtn = () => {
  const btnAddToCart = document.querySelectorAll('.item__add');
  btnAddToCart.forEach((btn) => btn.addEventListener('click', (event) => {
    addCart(event.target.parentElement.firstChild.innerText);
  }));
  totalPriceFunction();
};

// Requisito 1
const getAPIProduct = async () => {
  const getAPI = await fetch(('https://api.mercadolibre.com/sites/MLB/search?q=computador'));
  addLoadingText();
  const convertAPIJson = await getAPI.json();
  convertAPIJson.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    createProductItemElement({ sku, name, image }));
  addCartBtn();
  rmLoadingText();
};

window.onload = () => {
  getAPIProduct();
  localStorageLoad();
  emptyCartBtn();
};
