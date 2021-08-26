// Declaração de Constantes que serão utilizadas
const olCartItems = '.cart__items';

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

// Requisito 04 - Parte 02

function locStorageSave() {
  const itemsList = document.querySelector(olCartItems);
  localStorage.setItem('cartList', itemsList.innerHTML);
}

// Requisito 01

function apiML(mercadoria) {
  const api = `https://api.mercadolibre.com/sites/MLB/search?q=${mercadoria}`;
  return new Promise((resolve) => {
  fetch(api).then((response) => {
  response.json().then((dado) => {
    resolve(dado.results);
    });
  });
  });
}

// Requisito 02

function addToCartAPI(id) { // requisição para o endpoint
  const endpoint = `https://api.mercadolibre.com/items/${id}`; // valor id do item selecionado.
  return new Promise((resolve) => {
    fetch(endpoint).then((response) => {
    response.json().then((item) => {
      resolve(item);
      });
    });
  });
}

function cartItemClickListener(event) { 
  event.target.remove(); // Ref. site do MDN
  locStorageSave(); // Todas as adições e remoções devem ser abordadas para que a lista atual seja salva.
}

function locStorageLoad() {
  const shopList = document.querySelector(olCartItems);
  shopList.innerHTML = localStorage.getItem('cartList');
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class="price">${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener);
  locStorageSave();
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addToCart() {
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((button) =>
    button.addEventListener('click', async (event) => {
      const evento = event.target;
      const codSku = getSkuFromProductItem(evento.parentElement);
      const wait = await addToCartAPI(codSku);
      const cart1 = document.querySelector(olCartItems);
      cart1.appendChild(createCartItemElement(wait));
      locStorageSave(); // Ref. Todas as adições e remoções devem ser abordadas para que a lista atual seja salva.
    }));
}

// Ref. Requisito 01 - Função para criar os componentes HTML referentes a um produto.
const createProductItemElement = async () => {
  const results = await apiML();

  results.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    section.className = 'item';
    // abaixo uma constante que retorna o elemento section de classe 'items' (a que fica acima da section de classe cart) para inserir filhos para ela.
    const mainSection = document.querySelector('.items'); 

    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    mainSection.appendChild(section); // Insere elementos(sections) filhos de mainSection(section criada).
  });
  addToCart(); // chamada da função 
};

const clearCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  const totalPrice = document.querySelector('.total-price');
  btnClear.addEventListener('click', () => {
    const listaDeItens = document.querySelectorAll('.cart__item');
    listaDeItens.forEach((item) => {
      item.remove();
    });
    totalPrice.innerHTML = '0,00';
    locStorageSave();
  });
};

window.onload = async () => {
  apiML('computador');
  createProductItemElement();
  clearCart();
  locStorageLoad(); // Ao carregar a página, o estado atual do carrinho de compras deve ser carregado do LocalStorage.
};
