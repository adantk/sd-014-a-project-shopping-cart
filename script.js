const items = document.querySelector('.items');
let cart;

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  // Restringe o results para apenas as chaves id, title e thumbnail
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1
async function getComputer(query) {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`); // Busca api
  const json = await api.json(); // Deixa a API 'legivel' pro JS com o Json, transformando ela em objeto
  json.results.forEach((result) => items.appendChild(createProductItemElement(result)));
  // mapeia os results e coloca como parametro de createProductItemElement deixando ela como filha de items
}

// Requisito 2
async function getCart(itemId) {
  const api = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const json = await api.json();
  cart = {
    id: json.id,
    title: json.title,
    price: json.price,
  };
  const addCart = document.querySelector('.cart__items');
  return addCart.appendChild(createCartItemElement(cart));
}

function getId() {
  const button = document.getElementsByClassName('item__add');
  button.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const id = getSkuFromProductItem(event.target.parentNode);
      getCart(id);
    });
  });
}

window.onload = () => {
  getComputer('computador');
  getId();
};