const itens = document.querySelector('.items');
const preco = document.querySelector('.total-price');
const removeBtn = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('value', salePrice);

  return li;
}

const cartItems = document.querySelector('.cart__items');

const saveCart = () => {
  localStorage.clear();
  localStorage.setItem('itens', cartItems.innerHTML);
};

const sumValue = () => {
  let soma = 0;
  document.querySelectorAll('.cart__item').forEach((valor) => {
    const valorA = valor.getAttribute('value');
    soma += parseFloat(valorA);
  });
  preco.innerHTML = Math.round(soma * 100) / 100;
  saveCart();
};

const removeAll = () => {
  cartItems.innerHTML = '';
  sumValue();
  saveCart();
};

const remove = (ele) => {
  cartItems.removeChild(ele.target);
  sumValue();
  saveCart();
};

const cartItemClickListener = () => {
  const shop = document.querySelectorAll('.cart__item');
  shop.forEach((element) => element.addEventListener('click', remove));
};

const cart = () => {
  cartItems.innerHTML = localStorage.getItem('itens');
  cartItemClickListener();
};

const fetchCart = async (id) => {
  loading.innerHTML = 'loading...';
  const respRaw = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respJson = await respRaw.json();
  cartItems.appendChild(createCartItemElement({
    sku: respJson.id,
    name: respJson.title,
    salePrice: respJson.price,
  }));
  cartItemClickListener();
  sumValue();
  removeBtn.addEventListener('click', removeAll);
  saveCart();
  loading.remove();
};

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const btnAdd = () => document.querySelectorAll('.item__add').forEach((btn) =>
  btn.addEventListener('click', (e) => fetchCart(e.target.parentElement.firstChild.innerText)));

const fecthLista = async () => {
  loading.innerHTML = 'loading...';
  const respRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const respJson = await respRaw.json();
  respJson.results.forEach((arrays) => {
    itens.appendChild(createProductItemElement({
      sku: arrays.id,
      name: arrays.title,
      image: arrays.thumbnail,
      price: arrays.price,
    }));
  });
  
  btnAdd();
  cart();
  sumValue();
  loading.remove();
};

window.onload = () => { fecthLista(); };
