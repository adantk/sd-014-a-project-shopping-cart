const cartItem = document.getElementsByClassName('items');
const priceEl = document.getElementsByClassName('total-price');
let total = 0;

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

async function getDataApi() {
  const sectionEl = document.getElementsByClassName('items');
  const getData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonData = await getData.json();
  jsonData.results.forEach((dados) => {
    const data = {
      sku: dados.id,
      name: dados.title,
      image: dados.thumbnail,
    };
    sectionEl[0].appendChild(createProductItemElement(data));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const itemEvent = event.target.innerText;
  const idItem = itemEvent.slice(5, 18);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
  .then((response) => {
    response.json().then((itemPrice) => {
      total -= itemPrice.price;
      priceEl[0].innerText = total;
    });
  });
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getItemApi() {
  cartItem[0].addEventListener('click', (event) => {
    const itemId = event.target.parentElement;
    fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(itemId)}`)
    .then((response) => {
      response.json().then((itemData) => {
        const itemInfo = {
          sku: itemData.id,
          name: itemData.title,
          salePrice: itemData.price,
        };
        const getList = document.getElementsByClassName('cart__items');
        getList[0].appendChild(createCartItemElement(itemInfo));
        total += itemInfo.salePrice;
        priceEl[0].innerText = total;
      });
    });
  });
}

function removeAllItems() {
  const but = document.getElementsByClassName('empty-cart');
  but[0].addEventListener('click', () => {
    const list = document.getElementsByClassName('cart__items');
    // https://www.w3schools.com/jsref/met_node_removechild.asp
    while (list[0].hasChildNodes()) {  
      list[0].removeChild(list[0].firstChild);
    }
  });
}

window.onload = () => {
  getDataApi();
  getItemApi();
  removeAllItems();
};
