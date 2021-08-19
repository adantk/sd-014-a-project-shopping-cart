const baseURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
// const cart = document.getElementsByClassName('cart');
const phrase = '.cart__items';

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

function saveTasks() {
  const cart = document.querySelector(phrase);
    localStorage.setItem('items', cart.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveTasks();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveTasks();
  return li;
}

async function appendFetch() {
  try {
    const title = document.createElement('p');
    const items = document.querySelector('.items');
    title.className = 'loading';
    title.innerText = 'Loading';
    items.appendChild(title);
    const responseRaw = await fetch(baseURL);
    title.remove();
    const responseJSON = await responseRaw.json();
    const responseTotal = responseJSON.results;

    responseTotal.forEach((obj) => {
      const section = document.querySelector('.items');
      section.appendChild(createProductItemElement({
         sku: obj.id, name: obj.title, image: obj.thumbnail,
        }));
    });
  } catch (error) { console.log(error); }
} 

const addCart = async () => {
  const buttons = document.querySelectorAll('.item__add');
  const cartSelect = document.querySelector(phrase);
  try {
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const responseJSON = await responseRaw.json();
    const obj = responseJSON;
    await cartSelect.appendChild(createCartItemElement({
      sku: obj.id, name: obj.title, salePrice: obj.price,
    }));
    saveTasks();
    });
  });
} catch (error) {
  console.log(error);
}
};

const removeAll = () => {
  const getAllItems = document.querySelector(phrase);
  const removeBtn = document.querySelector('.empty-cart');
  function removeAllItems() {
    getAllItems.innerHTML = '';
    saveTasks();
  }
  removeBtn.addEventListener('click', removeAllItems);
};

const getItems = () => {
  const cartList = document.querySelector(phrase);
  cartList.innerHTML = localStorage.getItem('items');
  cartList.addEventListener('click', cartItemClickListener);
};

window.onload = async () => {
  await appendFetch();
  await addCart();
  await removeAll();
  getItems();
 };