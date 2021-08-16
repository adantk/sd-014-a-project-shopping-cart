const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

const saveLocalStorage = () => {
  localStorage.setItem('save', cart.innerHTML);
};

const loadLocalStorage = () => {
  const getSaveCart = localStorage.getItem('save');
  cart.innerHTML = getSaveCart;
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

function createProductItemElement({
  sku,
  name,
  image }) {
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
  saveLocalStorage(); // Ao clicar no item do carrinho o mesmo é removido!
}

function createCartItemElement({
  sku,
  name,
  salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchMercadoLivre = async (QUERY) => {
  const mlApi = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const request = await fetch(mlApi);
  const data = await request.json();
  const result = data.results;

  await result.forEach((i) => document.querySelector('.items')
  .appendChild(createProductItemElement({
    sku: i.id,
    name: i.title,
    image: i.thumbnail,
  })));
};

const fetchItem = () => {
  const btn = document.querySelectorAll('.item__add');
  
  btn.forEach((list) => { 
    list.addEventListener('click', async (event) => { 
      const targetId = event.target.parentElement; 
      const targetIdProduct = getSkuFromProductItem(targetId);
      const fetchItemMl = await fetch(`https://api.mercadolibre.com/items/${targetIdProduct}`);
      const response = await fetchItemMl.json();
      cart.appendChild(createCartItemElement({ 
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      }));
      saveLocalStorage();
    });
  });
};

const clearCart = () => {
const btnClear = document.querySelector('.empty-cart');

btnClear.addEventListener('click', () => {
  cart.innerHTML = null;
  });
};

window.onload = async () => {
  await fetchMercadoLivre('computador');
  fetchItem();
  clearCart();
  loadLocalStorage();
  cart.addEventListener('click', cartItemClickListener);
};
