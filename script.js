const cartItem = '.cart__items';

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
  const itemPai = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itemPai.appendChild(section);
  return section;
}
//  requisito 5
const createPriceSpan = () => {
  const spanPrice = document.createElement('span');
  const getCartSec = document.querySelector('.cart');
  spanPrice.className = 'total-price';
  getCartSec.appendChild(spanPrice);
  spanPrice.innerText = '$';
};

const somar = async () => {
  const pegaLista = document.querySelectorAll('.cart__item');
  let cont = 0;
  pegaLista.forEach((item) => {
  const num = item.innerText.split('$')[1];
  cont += parseFloat(num);
  });
  const price = document.querySelector('.total-price');
  price.innerText = cont;
};

// requisito storage
const setStorage = () => {
  localStorage.clear();
  const getCartList = document.querySelector(cartItem);
  localStorage.setItem('ol_cart', getCartList.innerHTML);
};

//  função requisito 3;
function cartItemClickListener(event) {
  event.target.remove();
  setStorage();
  somar();
}
//  requisito storage;
const loadStorage = () => {
  const getCartList = document.querySelector(cartItem);
  getCartList.innerHTML = localStorage.getItem('ol_cart');
  getCartList.addEventListener('click', cartItemClickListener);
  setStorage();
  somar();
};

// Requisito 6, btn pra limpar carrinho;
const btnClear = () => {
  const getBtn = document.querySelector('.empty-cart');
  const getList = document.querySelector(cartItem);
  getBtn.addEventListener('click', () => {
    getList.innerHTML = '';
    setStorage();
    somar();
  });  
};

//  funções requisito 2
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchId = async (ids) => {
  const pegarIdRaw = await fetch(`https://api.mercadolibre.com/items/${ids}`);
  const IdTrat = await pegarIdRaw.json();
  const { id, title, price } = IdTrat;
  const getCartList = document.querySelector(cartItem);
  getCartList.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));   
  setStorage(); 
  somar();
};

const lerBotao = () => {
  const listaItems = document.querySelectorAll('.item__add');
  listaItems.forEach((button) => button.addEventListener('click', (event) => {
    fetchId(event.target.parentElement.firstChild.innerText);
  }));
};

// função requisito 1;
const prodFetch = async () => { 
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((itemCarr) => itemCarr.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  }));
  lerBotao();
  btnClear();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  prodFetch();
  createPriceSpan();
  loadStorage();
};
