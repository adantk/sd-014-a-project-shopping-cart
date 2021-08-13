const fetchProducts = [];
const query = 'computadores';
const queryURL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const cartList = document.querySelector('.cart__items');
// const options = {
//   method: 'GET',
//   headers: { Authorization: 'Bearer $ACCESS_TOKEN' },
// };

// async function getProducts() {
  //   fetch(fetchURL)
  //   .then((response) => response.json())
  //   .then((list) => list.results.map((crr) => fetchProducts
  //   .push({ sku: crr.id, name: crr.title, salePrice: crr.price, image: crr.thumbnail })));
  // }
  
async function getJSON() {
  const responseRaw = await fetch(queryURL).then((response) => response.json());
  return responseRaw;
}

async function mapJSON() {
  const { results } = await getJSON();
  results.map((crr) => {
    const { id: sku, title: name, price: salePrice, thumbnail: image } = crr;
    return fetchProducts.push({ sku, name, salePrice, image });
  });
}

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
  // e.addEventListener('click', () => console.log('eitaa'));
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const { parentNode } = event.target.parentNode;
  const id = getSkuFromProductItem(parentNode);
  const itemURL = `https://api.mercadolibre.com/items/${id}`; 
  const responseJSON = await fetch(itemURL).then((response) => response.json());
  const { id: sku, title: name, price: salePrice } = responseJSON;
  const item = { sku, name, salePrice };
  console.log(sku + name + salePrice);
  const temp = createCartItemElement(item);
  cartList.appendChild(temp);
}

function emptyCart() {
  cartList.innerHTML = '';
}

function eventButtons() {
  const btnItems = document.querySelector('.items');
  const cartEmptyBtn = document.querySelector('.empty-cart');
  btnItems.addEventListener('click', addToCart);
  cartEmptyBtn.addEventListener('click', emptyCart);
}

window.onload = () => { 
  renderProducts();
  eventButtons();
};
