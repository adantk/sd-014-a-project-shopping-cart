const ol = document.querySelector('.cart__items');
const priceText = document.querySelector('.total-price');

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const items = document.querySelector('.items');
  items.appendChild(section);
}

// 1 - find and display products on the screen
const fetchItems = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((result) => result.json()).then((data) => {
    data.results.forEach((product) => {
     createProductItemElement(product);
    });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; // retornando o id do produto com base na posição da section passado por parametro
}

// saving both cart items ante price on local storage
const saveInLocalStorage = () => {
  localStorage.setItem('saved', ol.innerHTML);
  localStorage.setItem('price', priceText.innerHTML);
};

// 5 - sum products prices
const sumPrices = () => {
  const olPrices = document.querySelectorAll('.cart__item');
  let sum = 0;

  olPrices.forEach((element) => {
    sum += parseFloat(element.innerHTML.split('$')[1]); // separando somente o preço do produto, que fica após o $ e somando a variavel sum
  });
  priceText.innerHTML = Math.round(sum * 100) / 100; // deixando o número so com duas casas decimais
  saveInLocalStorage();
};

// 3 - erase product on cart
function cartItemClickListener(event) {
  event.target.remove();
  saveInLocalStorage();
  sumPrices();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  ol.appendChild(li);
  saveInLocalStorage();
  sumPrices();
}

// 2 - fecht id and call the cart creation function
const fetchID = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((result) => result.json()).then((data) => {
    createCartItemElement(data);
  });
};

// 2 - find id to fetch
const findID = () => {
  const button = document.querySelector('.items');

  button.addEventListener('click', (e) => {
    if (e.target.classList.contains('item__add')) {
      const id = getSkuFromProductItem(e.target.parentElement); // capturando a posição exata do elemento section, que é pai do botao clicado
      fetchID(id);
    }
  });
};

// 4 - erase saved items
const eraseSaved = () => {
  ol.addEventListener('click', (li) => {
    if (li.target.classList.contains('cart__item')) {
      cartItemClickListener(li);
    }
  });
};

// 6 - clear cart
const clearCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    ol.innerHTML = '';
    priceText.innerHTML = '0';
    localStorage.clear();
  });
};

const loadLocalStorage = () => {
  if (localStorage.saved !== undefined && localStorage.price !== undefined) {
    ol.innerHTML = localStorage.saved;
    priceText.innerHTML = localStorage.price;
  }
};

window.onload = () => { 
  loadLocalStorage();
  fetchItems();
  findID();
  eraseSaved();
  clearCart();
};
