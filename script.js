const storageKey = 'ol-content';
const cartItemsClass = '.cart__items';
const emptyCartClass = '.empty-cart';
const cartClass = '.cart';

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function sum(ol) {
  const totalPrice = document.querySelector('.total-price');
  const regex1 = /([$][1-9])\S+/i;
  const regex2 = /([1-9])\S+/;
  let total = 0;
  ol.childNodes.forEach((li) => {
    const found = li.innerText.match(regex1);
    total += Number(found[0].match(regex2)[0]);
  });
  total = Math.round(100 * total) / 100;
  totalPrice.innerText = total;
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector(cartItemsClass);
  event.target.parentElement.removeChild(event.target);
  localStorage.setItem(storageKey, cartItems.innerHTML);
  sum(cartItems);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const loadingSpan = document.createElement('span');
  loadingSpan.innerText = 'Loading ...';
  loadingSpan.className = 'loading';
  document.querySelector(cartClass).appendChild(loadingSpan);  
}

function deleteLoading() {
  document.querySelector(cartClass).removeChild(document.querySelector('.loading'));
}

function getComputersFromMlApi() {
  createLoading();
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((json) => json.results);
}

function getComputerItemFromMlApi(sku) {
  createLoading();
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json());    
}

function addItemToCart(event) {
  const cartItems = document.querySelector(cartItemsClass);
  const skuItem = event.target.parentElement.firstChild.innerText;
  getComputerItemFromMlApi(skuItem)
    .then(({ id: sku, title: name, price: salePrice }) => {
      const li = createCartItemElement({ sku, name, salePrice });
      cartItems.appendChild(li);
      localStorage.setItem(storageKey, cartItems.innerHTML);
      sum(cartItems);
    })
    .then(() => deleteLoading());
}

function getLocalStorage() {
  const cartItems = document.querySelector(cartItemsClass);
  cartItems.innerHTML = localStorage.getItem(storageKey)
    ? localStorage.getItem(storageKey)
    : '';
  cartItems.childNodes.forEach((li) =>
    li.addEventListener('click', cartItemClickListener));
  sum(cartItems);
}

function clearAll() {
  const cartItems = document.querySelector(cartItemsClass);
  cartItems.innerHTML = '';
  sum(cartItems);  
}

window.onload = () => {
  const items = document.querySelector('.items');
  document.querySelector(emptyCartClass).addEventListener('click', clearAll);
  getLocalStorage();
  getComputersFromMlApi()
    .then((computers) =>
      computers.forEach(({ id: sku, title: name, thumbnail: image }) => {
        const section = createProductItemElement({ sku, name, image });
        items.appendChild(section);
        items.lastChild.lastChild.addEventListener('click', addItemToCart);      
      }))
    .then(() => deleteLoading());
};
