const endPoints = {
  computer: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  item: 'https://api.mercadolibre.com/items/',     
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
  event.target.remove();  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchData(endpoint, query) {
  const api = `${endpoint}${query || ''}`;
  const response = await fetch(api);
  const json = await response.json();
  return json;
}// ajuda dos colegas.(modificado para ficar dinamico.)

async function addProducts(section) {
  const products = await fetchData(endPoints.computer, 'computador')
  .then((json) => json.results);
  products.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const product = createProductItemElement({ sku, name, image });
      section.appendChild(product);    
  });
}// ajuda dos colegas.

async function addCart(event) {
  if (event.target.classList.contains('item__add')) { 
    const productId = getSkuFromProductItem(event.target.parentElement);
    const productInfo = await fetchData(endPoints.item, productId)
      .then(({ title: name, price: salePrice }) => (
        { sku: productId, name, salePrice }
      ));
    const productElement = createCartItemElement(productInfo);
    productElement.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(productElement);
  }
}

async function eventPage() {
  const products = document.querySelector('.items');
  await addProducts(products);
  products.addEventListener('click', addCart);
}

window.onload = () => { 
  eventPage();
};