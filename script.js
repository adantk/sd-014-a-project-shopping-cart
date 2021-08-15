const cartItemsDuplicate = '.cart__items';

const mercadolivreAPI = () => {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(api).then((response) => {
      response.json().then((data) => {
        resolve(data.results);
      });
    });
  });
};

const itemAPI = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  return new Promise((resolve) => {
    fetch(endpoint).then((response) => {
      response.json().then((item) => {
        resolve(item);
      });
    });
  });
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

const saveLocalStorage = () => {
  const itemsList = document.querySelector(cartItemsDuplicate);
  localStorage.setItem('cartList', itemsList.innerHTML);
};

const somaPrecos = () => {
  const selectPrice = document.querySelectorAll('.price');
  const precoTotal = [...selectPrice].reduce((acc, curr) => 
  acc + parseFloat(parseFloat(curr.innerText).toFixed(2)), 0); /* Solução obtida a partir do vídeo: https://www.youtube.com/watch?v=wLeSTjpTfsg&ab_channel=MatheusBattisti-HoradeCodar */
  document.querySelector('.total-price').innerText = precoTotal;
};

function cartItemClickListener(event) { /* Com base na função 'remove': https://developer.mozilla.org/en-US/docs/Web/API/Element/remove */
  event.target.remove();
  saveLocalStorage();
  somaPrecos();
}

const loadLocalStorage = () => {
  const listCompras = document.querySelector(cartItemsDuplicate);
  listCompras.innerHTML = localStorage.getItem('cartList');
  const itemsCarts = document.querySelectorAll('.cart__item');
  itemsCarts.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class="price">${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener);
  saveLocalStorage();
  return li;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const adicionaItem = () => {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((button) =>
    button.addEventListener('click', async (event) => {
      const evento = event.target;
      const sku = getSkuFromProductItem(evento.parentElement);
      const wait = await itemAPI(sku);
      const carrinho = document.querySelector(cartItemsDuplicate);
      carrinho.appendChild(createCartItemElement(wait));
      saveLocalStorage();
      somaPrecos();
    }));
};

const createProductItemElement = async () => {
  const results = await mercadolivreAPI();

  results.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    const items = document.querySelector('.items');
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    items.appendChild(section);
  });
  adicionaItem();
};

function limparCarrinho() {
  const btnClear = document.querySelector('.empty-cart');
  const totalPrice = document.querySelector('.total-price');
  btnClear.addEventListener('click', () => {
    const listaDeItens = document.querySelectorAll('.cart__item');
    listaDeItens.forEach((item) => {
      item.remove();
    });
    totalPrice.innerHTML = '0,00';
    saveLocalStorage();
  });
}

window.onload = () => {
  mercadolivreAPI();
  createProductItemElement();
  loadLocalStorage();
  limparCarrinho();
};
