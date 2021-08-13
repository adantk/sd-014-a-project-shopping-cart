const fetchProducts = [];
const query = 'computadores';
const fetchURL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const options = {
  method: 'GET',
  headers: { Authorization: 'Bearer $ACCESS_TOKEN' },
};

// async function getProducts() {
  //   fetch(fetchURL)
  //   .then((response) => response.json())
  //   .then((list) => list.results.map((crr) => fetchProducts
  //   .push({ sku: crr.id, name: crr.title, salePrice: crr.price, image: crr.thumbnail })));
  // }
  
async function getJSON() {
  const response = await fetch(fetchURL, options).then((response) => response.json());
  return response;
}

async function mapJSON() {
  const { results } = await getJSON();
  results.map((crr) => {
    const { id: sku, title: name, price: salePrice, thumbnail: image } = crr;
    return fetchProducts.push({ sku, name, salePrice, image });
  });
}

// async function getProduct() {
//   const itemURL = `https://api.mercadolibre.com/items/${itemID}`;
//   const response = await fetch(itemURL, options).then((response) => response.json());
//   return response;
// }


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

async function renderProducts() {
  await mapJSON();
  const itemsSection = document.querySelector('.items');
  for (let i = 0; i < fetchProducts.length; i += 1) {
    const product = createProductItemElement(fetchProducts[i]);
    itemsSection.appendChild(product);
  }
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

window.onload = () => { 
  renderProducts();
};
