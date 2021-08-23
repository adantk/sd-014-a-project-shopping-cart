const listaProdutos = document.querySelector('.items');
const itensCarrinho = document.querySelector('.cart__items');
const btnEmptyCart = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
const loading = document.querySelector('.loading');

const sumTotalPrice = () => {
  let priceSum = 0;
  itensCarrinho.childNodes.forEach((item) => {
    priceSum += parseFloat(item.innerText.split('$')[1]);
  });
  totalPrice.innerText = `${priceSum}`;
};

const isLoading = () => {
  loading.parentNode.removeChild(loading);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  // Remove o item do carrinho ao clicar
  event.target.remove();
  sumTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProdutos = async (query) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  isLoading();
  return data;
};

const cartAdd = () => {
  listaProdutos.addEventListener('click', async (event) => {
    if (event.target.classList.contains('item__add')) {
      const idSku = getSkuFromProductItem(event.target.parentElement);
      const response = await fetch(`https://api.mercadolibre.com/items/${idSku}`);
      const data = await response.json();
      itensCarrinho.appendChild(createCartItemElement(data));
      sumTotalPrice();
      localStorage.setItem('list', itensCarrinho.innerHTML);
    }
  });
};

const clearCart = () => {
  btnEmptyCart.addEventListener('click', () => { 
    itensCarrinho.innerHTML = '';
    sumTotalPrice();
    localStorage.setItem('list', itensCarrinho.innerHTML);
  });
};

const runLocalStorage = () => {
  itensCarrinho.innerHTML = localStorage.getItem('list') ? localStorage.getItem('list') : '';
  itensCarrinho.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));  
};

window.onload = () => { 
  runLocalStorage();
  fetchProdutos('computador')
  .then((data) => data.results)
  .then((results) => results.forEach((item) => {
    listaProdutos.appendChild(createProductItemElement(item));
  }));
  sumTotalPrice();
  cartAdd();
  clearCart();
};
