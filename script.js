let total = 0;
const itemsSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const emptyCartButton = document.querySelector('.empty-cart');
const load = document.createElement('div');
load.className = 'loading';
itemsSection.appendChild(load);

const setLocalItems = () => {
  localStorage.setItem('cart', cartItems.innerHTML);
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  cartItems.removeChild(event.target);
  total -= event.target.id;
  totalPrice.innerHTML = total;
  setLocalItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendSection = (object) => {
  const { id, title, thumbnail } = object;
  const obj = {
    sku: id,
    name: title,
    image: thumbnail,
  };
  const child = createProductItemElement(obj);

  itemsSection.appendChild(child);
};

const getAndAddElement = async (event) => {
 const item = (event.target.parentNode);
 const itemID = getSkuFromProductItem(item);

 load.innerText = 'loading...';
 const resolveRaw = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
 const resolveJSON = await resolveRaw.json();
 const { id, title, price } = resolveJSON;
 const obj = {
   sku: id,
   name: title,
   salePrice: price,
 };
 load.remove();
 const child = createCartItemElement(obj);
 cartItems.appendChild(child);
 total += price;
 totalPrice.innerHTML = total;
 setLocalItems();
};

const fetchCart = async () => {
  const itemsAdd = document.querySelectorAll('.item__add');

  itemsAdd.forEach((element) => {
    element.addEventListener('click', getAndAddElement);
  });
};
 
const fetchItems = async () => {
  load.innerText = 'loading...';
  const resolveRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resolveJSON = await resolveRaw.json();
  resolveJSON.results.forEach((element) => {
    appendSection(element);
  });
  load.remove();
  fetchCart();
};

const cartEventListener = () => {
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

const calculateTotal = () => {
  if (localStorage.cart) {
    const elements = document.querySelectorAll('.cart__item');
    console.log(elements);
    elements.forEach((e) => { total += Number(e.id); });
  } 
   totalPrice.innerHTML = total;
};

emptyCartButton.addEventListener('click', () => {
  cartItems.innerHTML = '';
  total = 0;
  totalPrice.innerHTML = total;
});

window.onload = () => {
  if (localStorage.cart) {
    cartItems.innerHTML = localStorage.cart;
  }
  calculateTotal();
  cartEventListener();
  
  fetchItems();
};
