const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

/**
 * Função para a soma dos valores dos items
 * do carrinho. Ela será invocada na função
 * action e na cartItemClickListener, a fim de
 * atualizar a soma em cada interação do carrinho.
 */
const sumOfProducts = async () => {
  const itemsCart = document.querySelectorAll('.cart__item');
  const pElement = document.querySelector('.total-price');
  let sum = 0;
  itemsCart.forEach((item) => {
    const value = parseFloat(item.innerText.split('$')[1]);
    sum += value;
  });
  sum = (Math.round(sum * 100)) / 100;
  pElement.innerText = `${sum}`;
};

/**
 * Função que é disparada quando há o clique em algum
 * elementos do cart para removê-lo.
 * @param {event} e Evento de clique 
 */
function cartItemClickListener(e) {  
  e.target.parentNode.removeChild(e.target);
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  cartItems.forEach((item, i, arr) => {
    if (item === e.target.innerHTML) arr.splice(i, 1); 
  });
  localStorage.setItem('cart', JSON.stringify(cartItems));
  sumOfProducts();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const action = async (e) => {
  if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
  const itemsCart = JSON.parse(localStorage.getItem('cart'));
  const id = getSkuFromProductItem(e.target.parentNode);
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const request = await response.json();
  const { id: sku, title: name, price: salePrice } = request;
  const newCartElement = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(newCartElement);
  itemsCart.push(newCartElement.innerHTML);
  localStorage.setItem('cart', JSON.stringify(itemsCart));
  sumOfProducts();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addBtn.addEventListener('click', action);
  section.appendChild(addBtn);

  return section;
}

/**
 * Função assíncrona para trazer o array de produtos.
 * Primeiramente faço um fetch usando um endpoint,
 * depois faço o tratamento da promise, transformando-a
 * em um JSON.
 * @returns array
 */
const fetchProducts = async () => {
  const request = await fetch(endpoint);
  const response = await request.json();
  const arrOfProducts = response.results;
  return arrOfProducts;
};

/**
 * Função que desestrutura o objeto passado por parâmetro
 * e adiciona à section.items o elemento criado pela função
 * createProductItemElement.
 * @param {object} product Produto contido no arrOfProducts
 */
const createProducts = (product) => {
  const { id: sku, title: name, thumbnail: image } = product;
  document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
};

const addProducts = async () => {
  const arrOfProducts = await fetchProducts();
  arrOfProducts.forEach(createProducts);
};

const loadLocalStorage = async () => {
  if (localStorage.getItem('cart')) {
    const itemsCart = JSON.parse(localStorage.getItem('cart'));
    itemsCart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.addEventListener('click', cartItemClickListener);
      li.innerText = item;
      document.querySelector('.cart__items').appendChild(li);
    });
  }
};

window.onload = async () => {
  await addProducts();
  await loadLocalStorage();
  sumOfProducts();
};
