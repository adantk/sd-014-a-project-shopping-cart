const baseUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemsUrl = 'https://api.mercadolibre.com/items/';

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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchData(url) {
  const results = await fetch(url)
    .then((res) => res.json());
  return results;
}

function appendItem(item, classElement) {
  document.querySelector(classElement).appendChild(item);
}

async function putItemOnCart(id) {
  const { title, price } = await fetchData(itemsUrl + id);
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  appendItem(item, '.cart__items');
}

function addCartButtonListener() {
  const addItem = document.querySelectorAll('.item__add');
  addItem.forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      putItemOnCart(ev.target.parentElement.firstChild.innerText);
    });
  });
}

window.onload = async () => {
  const { results } = await fetchData(baseUrl);

  await results.forEach((element) => {
    const infos = { 
      sku: element.id, 
      name: element.title, 
      image: `${element.thumbnail.slice(0, -5)}L.jpg`, 
    };
    appendItem(createProductItemElement(infos), '.items');
  });

  addCartButtonListener();
};