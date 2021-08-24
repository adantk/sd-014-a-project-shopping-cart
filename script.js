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
  const sectionItems = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__ sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sectionItems.appendChild(section);
  return section;
}

// Requisito 6
const emptyCartBtn = () => {
  const emptyCart = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  emptyCart.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

const addLoadingText = () => {
  const loading = document.querySelector('.loading');
  loading.innerHTML = 'loading...';
};

const rmLoadingText = () => {
  const rmLoading = document.querySelector('.loading');
  rmLoading.remove();
};

// Requisito 2 - p1
const addCart = async (productId) => {
  const productSearch = await fetch((`https://api.mercadolibre.com/items/${productId}`));
  const pSJson = await productSearch.json();
  createCartItemElement({ sku: pSJson.id, name: pSJson.title, salePrice: pSJson.price });
};

// Requisito 2 - p2
const addCartBtn = () => {
  const btnAddToCart = document.querySelectorAll('.item__add');
  btnAddToCart.forEach((btn) => btn.addEventListener('click', (event) => {
    addCart(event.target.parentElement.firstChild.innerText);
  }));
};

// Requisito 1
const getAPIProduct = async () => {
  const getAPI = await fetch(('https://api.mercadolibre.com/sites/MLB/search?q=computador'));
  addLoadingText();
  const convertAPIJson = await getAPI.json();
  convertAPIJson.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    createProductItemElement({ sku, name, image }));
  addCartBtn();
  rmLoadingText();
};

window.onload = () => {
  getAPIProduct();
  emptyCartBtn();
};
