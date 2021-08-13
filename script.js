const ENDPOINTS = {
  list: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  item: 'https://api.mercadolibre.com/items/',
};

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
 * Busca dados da API do Mercado Livre
 * @param {string} endpoint Endpoint da API
 * @param {string=} query (opcional) Consulta
 * @returns 
 */
async function fetchMLData(endpoint, query) {
  const path = `${endpoint}${query || ''}`;
  const response = await fetch(path);
  const data = await response.json();
  return data;
}

/**
 * Adiciona os produtos na seção principal
 */
async function addProducts(section) {
  const products = await fetchMLData(ENDPOINTS.list, 'computador')
    .then((data) => data.results);
  products.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const product = createProductItemElement({ sku, name, image });
    section.appendChild(product);
  });
}

/**
 * Callback dos botões de Adicionar ao Carrinho
 * @param {Event} event Evento
 */
function addToCart(event) {
  if (event.target.classList.contains('item__add')) {
    // pega SKU (ID) do primeiro span
    const productId = event.target.parentElement.firstElementChild.innerText;
    fetchMLData(ENDPOINTS.item, productId)
      .then((response) => console.log(response));
  }
}

/**
 * Carregamento de dados e preparação de listeners
 */
async function preparePage() {
  const productsSection = document.querySelector('.items');
  await addProducts(productsSection);
  productsSection.addEventListener('click', addToCart);
}

window.onload = () => { 
  preparePage();
};
