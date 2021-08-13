function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function getSkuFromProductItem(item) {
  const addButton = await item.target.parentNode;
  return addButton.querySelector('span.item__sku').innerText;
}

const fetchRequestEndpoint = async (idProduct) => {
  return fetch(`https://api.mercadolibre.com/items/${idProduct}`)
   .then((response) => response.json());
};

function createCartItemElement({sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event)=> {
  const idProductAdd = await getSkuFromProductItem(event);
  const returnEndPoint = await fetchRequestEndpoint(idProductAdd);
  const { id, title, price } = await returnEndPoint;
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
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
  section.addEventListener('click', addItemToCart);
  return section;
}

const requestProduct = () => {

}

async function cartItemClickListener(event) {
  // const skuSelected = await getSkuFromProductItem();
  // console.log()
  // await requestEndpoint()
  
}

const fetchProduct = async (search) => {
 return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then((response) => response.json().then((searchResult) => searchResult.results));
};

const loadElements = async (search) => {
  const result = await fetchProduct(search);
  result.forEach(({ id, title, thumbnail }) => document.querySelector('.items')
    .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
};
  
window.onload = () => {
    loadElements('computador');
};