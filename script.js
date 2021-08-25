const CART_ITEMS_CLASS = '.cart__items';

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

const clearCart = () => {
  const cartSection = document.querySelector(CART_ITEMS_CLASS);
  while (cartSection.firstChild) {
    cartSection.removeChild(cartSection.firstChild);
  }
};

function cartItemClickListener(event) {
  event.target.remove();
}

const sumCartPrice = () => {
  //  Função do requisito 5
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadingStatus = (bool) => {
  const productSection = document.getElementsByClassName('items')[0];
  if (bool === true) {
    const loadingText = document.createElement('h1');
    loadingText.className = 'loading';
    loadingText.innerText = 'Loading...';
    productSection.appendChild(loadingText);
    return 0;
  }
  productSection.removeChild(productSection.firstChild);
};

const loadProducts = async () => {
  const productSection = document.querySelector('.items');
  loadingStatus(true);
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const products = await response.json();
  loadingStatus(false);
  products.results.forEach((product) => {
    const productInfoParameter = { sku: product.id, name: product.title, image: product.thumbnail };
    const productViewer = createProductItemElement(productInfoParameter);
    productSection.appendChild(productViewer);
  });
};

const addToCart = async (event) => {
  const productId = event.target.parentNode.firstChild.firstChild.nodeValue;
  const cartSection = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const productInfo = await response.json();
  const parameters = { sku: productInfo.id, name: productInfo.title, salePrice: productInfo.price };
  const productHTML = createCartItemElement(parameters);
  cartSection.appendChild(productHTML);
  sumCartPrice(); //  Calcula o total do preço dos produtos no carrinho
};

const addToCartImplementation = () => {
  const addToCartButtons = document.querySelectorAll('.item__add');
  for (let index = 0; index < addToCartButtons.length; index += 1) {
    addToCartButtons[index].addEventListener('click', addToCart);
  }
};

window.onload = async () => { 
  await loadProducts(); //  Carrega os produtos do ML na página
  addToCartImplementation(); // Adiciona event listeners aos botões de Adicionar ao carrinho
};