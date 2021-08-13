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

// Requisito 1
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItem = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  sectionItem.appendChild(section);
  return sectionItem;
}

const getJson = async () => {
  const loading = createCustomElement('h1', 'loading', 'loading');
  loading.className = 'loading';
  document.body.appendChild(loading);
  const productsArr = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  )
    .then((r) => r.json())
    .then((obj) => obj.results);
  productsArr.forEach((product) => {
    createProductItemElement(product);
  });
  addToCartButton();
  loading.remove();
};
// ---------------------------

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

// Requisito 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCartButton = () => {
  const button = document.querySelectorAll('.item__add');

  console.log(button);
  button.forEach((item) =>
    item.addEventListener('click', async (event) => {
      const cart = document.querySelector('.cart__items');
      const productElement = event.target.parentElement;
      const sku = productElement.firstChild.innerText;

      const productJson = await fetch(
        `https://api.mercadolibre.com/items/${sku}`,
      ).then((r) => r.json());
      cart.appendChild(createCartItemElement(productJson));
      totalSum();
      localStorage.setItem('stored', cart.innerHTML);
    }));
};
// ---------------------------
// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  totalSum();
}
// ---------------------------

window.onload = () => {
  getJson();
 };
