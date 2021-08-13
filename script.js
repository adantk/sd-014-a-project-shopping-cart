const ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

/**
 * Puxa os produtos do Mercado Livre
 * @returns lista dos produtos
 */
async function fetchProducts() {
  const response = await fetch(ENDPOINT);
  const json = await response.json();
  return json.results;
}

/**
 * Adiciona os produtos na seção principal
 */
function addProducts() {
  const productsSection = document.querySelector('.items');
  fetchProducts().then((products) => {
    products.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const product = createProductItemElement({ sku, name, image });
      productsSection.appendChild(product);
    });
  });
}

window.onload = () => { 
  addProducts();
};
