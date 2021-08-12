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

const displayResult = (result) => {
  const productsContainer = document.querySelector('.items');
  result.forEach(({ id, title, thumbnail }) => {
    const itemParams = {
      name: title,
      sku: id,
      image: thumbnail,
    };
    const productElement = createProductItemElement(itemParams);
    productsContainer.appendChild(productElement);
  });
};

const searchApi = async (productName = 'computador') => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${productName}`;
  try {
    const result = await (await fetch(url)).json();
    displayResult(result.results);
  } catch (error) {
    return error; // fix this display error
  }
};

function modifyArr(arr, item, method) {
  if (method === 'add') arr.push(item);
  else if (method === 'removeAll') arr.splice(0, arr.length);
  else {
    const index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
  }
  return arr;
}

function cartLocalStorage(item, method) {
  if (!localStorage.itemsCard) localStorage.itemsCard = '[]';
  const arr = JSON.parse(localStorage.itemsCard);
  localStorage.itemsCard = JSON.stringify(modifyArr(arr, item, method));
}

function cartItemClickListener(event) {
  const text = event.target.innerText;
  const sku = text.split('|')[0].split('SKU: ')[1].trim();
  event.target.remove();
  cartLocalStorage(sku, 'remove');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function displayItemOnCard(item) {
  const cardList = document.querySelector('.cart__items');
  const { id: sku, title: name, price: salePrice } = item;
  const itemElement = createCartItemElement({ sku, name, salePrice });
  cardList.appendChild(itemElement);
}

async function getItemDetails(itemId) {
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    displayItemOnCard(await (await fetch(url)).json());
  } catch (error) {
    return error; // fix this display error
  }
}

async function recoverItens() {
  const items = JSON.parse(localStorage.itemsCard);
  items.forEach((item) => getItemDetails(item));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function itemsClickListener(event) {
  const { target } = event;
  if (target.classList.contains('item__add')) {
    const itemID = getSkuFromProductItem(target.parentNode);
    cartLocalStorage(itemID, 'add');
    getItemDetails(itemID);
  }
}

window.onload = () => {
  const productsContainer = document.querySelector('.items');
  searchApi();
  productsContainer.addEventListener('click', itemsClickListener);
  recoverItens();
};
