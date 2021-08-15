const itens = document.querySelector('.items');

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
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCart = async (id) => {
  const respRaw = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respJson = await respRaw.json();
  // console.log(respJson);
  const addItems = document.querySelector('.cart__items');
  addItems.appendChild(createCartItemElement({
    sku: respJson.id,
    name: respJson.title,
    salePrice: respJson.price,
  }));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const btnAdd = () => document.querySelectorAll('.item__add').forEach((btn) =>
  btn.addEventListener('click', (e) => fetchCart(e.target.parentElement.firstChild.innerText)));

const fecthLista = async () => {
  const respRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const respJson = await respRaw.json();
  respJson.results.forEach((arrays) => {
    itens.appendChild(createProductItemElement({
      sku: arrays.id,
      name: arrays.title,
      image: arrays.thumbnail,
    }));
  });
  btnAdd();
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// const url = 'https://api.mercadolibre.com/items/';

window.onload = () => { fecthLista(); };
