const cartItems = '.cart__items';
const listCart = document.querySelector(cartItems);
// const clearCartBtn = document.querySelector('.empty-cart');
const totalPrice = '.total-price';
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

// REQUISITO 4
const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', listCart.innerHTML);
};

const cartTotalPrice = (price) => {
  const getInitialPrice = document.querySelector(totalPrice).innerText;
  const sumPrice = Number(getInitialPrice) + Number(price);
  document.querySelector(totalPrice).innerText = Math.round(sumPrice * 100) / 100;
};

 function cartItemClickListener(event) {  
  const catchParent = document.querySelector(cartItems);
  const catchChild = document.querySelector('.cart__item');
  catchParent.removeChild(catchChild);
  const priceCart = event.target.innerHTML.split('$')[1];
  cartTotalPrice(`-${priceCart}`);
  saveCartToLocalStorage(); // REQUISITO 4
}

 function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts() {
  const computadorURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(computadorURL);
  const product = await response.json();
  return product;
}

async function fetchProducts() {
  const productList = await getProducts();
  console.log(productList.results);
  productList.results.forEach((product) => {
    const element = createProductItemElement(product);
    const items = document.querySelector('.items');
    items.appendChild(element);
  }); 
}

const addCartItem = () => {
  const addButton = document.querySelectorAll('.item__add');
  const cartList = document.querySelector('.cart__items');
  addButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      // Linha 66 com auxílio do MDN Web Docs - https://developer.mozilla.org/pt-BR/docs/Web/API/Node/parentNode
      const itemID = getSkuFromProductItem(event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then((response) => response.json())
      .then((product) => {
        const li = createCartItemElement(product);
        cartList.appendChild(li);
        cartTotalPrice(product.price);
        saveCartToLocalStorage(); // REQUISITO 4
      });
    });
  });
};

const loadingAPI = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

// REQUISITO 4
const updateLocalStorage = () => {
  listCart.innerHTML = localStorage.getItem('cart');
  listCart.addEventListener('click', cartItemClickListener);
  console.log(document.querySelector(cartItems));
};

window.onload = async function onload() { 
  await fetchProducts();
  loadingAPI();
  addCartItem();
  cartItemClickListener();  
  updateLocalStorage(); // REQUISITO 4
};
