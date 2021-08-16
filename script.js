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
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productList = async () => {
  const items = document.querySelector('.items');
  const consulta = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objetoJson = await consulta.json();
  objetoJson.results.forEach((product) => {
    const dataProducts = { sku: product.id, name: product.title, image: product.thumbnail };
    items.appendChild(createProductItemElement(dataProducts));
  });
};

const addProductCart = async (id) => {
  const ol = document.querySelector('.cart__items');
  const consulta = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objetoJson = await consulta.json();
  console.log('Passou aqui');
  ol.appendChild(createCartItemElement({ sku: objetoJson.id, 
    name: objetoJson.title, 
    salePrice: objetoJson.price }));
};
const clique = (e) => {
  const productId = e.target.parentElement.firstChild.innerText;
  addProductCart(productId);
};
const btnAddProduct = () => {
   const items = document.querySelector('.items');
   items.addEventListener('click', clique);
};
window.onload = () => { 
  productList();
  btnAddProduct();
};
