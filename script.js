const cartItemsClass = '.cart__items';
const totalPriceCart = '.total-price';
let cartPrice = 0;

const transformToBrl = (price) => 
  // Transforma moeda para formato Brazilian Real
   Intl.NumberFormat('pr-BR', { style: 'currency', currency: 'BRL' }).format(price);

const whileLoading = () => {
  // Mostra mensagem loading enquanto aguarda resposta da API
  const loading = document.createElement('span');
  loading.innerHTML = 'loading...';
  loading.className = 'loading';
  const loadingPlace = document.querySelector('.cart');
  loadingPlace.appendChild(loading);
};

const removeLoading = () => {
  // Retira mensagem loading da tela após receber resposta da API
  const loading = document.querySelector('.loading');
  loading.remove();
};

const savePriceToLocalStorage = (totalPrice) => {
  // salva valor total do carrinho no localStorage
  localStorage.setItem('totalPrice', totalPrice);
};
  
const saveToLocalStorage = (cart) => { 
  // salva itens do carrinho no localStorage
  localStorage.setItem('cartList', cart.innerHTML);
};

const addPriceItem = (price) => {
  // adiciona itens ao carrinho
  const totalPrice = document.querySelector(totalPriceCart);
  cartPrice += price;
  totalPrice.innerHTML = transformToBrl(cartPrice);
  savePriceToLocalStorage(cartPrice);
};

const removePriceItem = (price) => {
  // remove itens do carrinho
  const totalPrice = document.querySelector(totalPriceCart);
  cartPrice -= price;
  totalPrice.innerHTML = transformToBrl(cartPrice);
  savePriceToLocalStorage(cartPrice);
};

function cartItemClickListener(event) {
  // remove item clicado do carrinho
  const cart = document.querySelector(cartItemsClass);
  const itemHtml = event.target.innerHTML;
  const priceItem = Number(itemHtml.split('PRICE: $')[1]);
  removePriceItem(priceItem);
  event.target.remove();
  saveToLocalStorage(cart);
}

const loadCartFromStorage = () => {
  // carrega carrinho do localStorage
  const cart = document.querySelector(cartItemsClass);
  const cartLocalStorage = localStorage.getItem('cartList');
  const priceLocalStorage = localStorage.getItem('totalPrice');
  cart.innerHTML = (cartLocalStorage);
  if (priceLocalStorage) cartPrice = Number(priceLocalStorage);
  Array.from(cart.children).forEach((item) => 
    item.addEventListener('click', cartItemClickListener));
  /** Consultei o repositório do Gustavo Dias para resolver essa parte final com 'cart.children'
  * Link: https://github.com/tryber/sd-014-a-project-shopping-cart/tree/gustavo-dias-project-shopping-cart
  */ 
};

function createProductImageElement(imageSource) {
  // cria imagem para item da lista de produtos
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

 function getSkuFromProductItem(item) {
   // retorna id do item correspondente ao botao 'adicionar ao carrinho' foi clicado
  const addButton = item.target.parentNode;
  return addButton.querySelector('span.item__sku').innerText;
}

const fetchRequestEndpoint = async (idProduct) => {
  // chama a API para um produto através do id
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
  const responseJson = await responseRaw.json();
  return responseJson;
};

function createCartItemElement({ sku, name, salePrice }) {
  // cria os itens adicionados ao carrinho
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event) => {
  // adiciona item clicado ao carrinho
  whileLoading();
  const idProductAdd = await getSkuFromProductItem(event);
  const returnEndPoint = await fetchRequestEndpoint(idProductAdd);
  const { id, title, price } = await returnEndPoint;
  const cart = document.querySelector(cartItemsClass);
  cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  saveToLocalStorage(cart);
  addPriceItem(price);
  removeLoading();
};

function createCustomElement(element, className, innerText) {
  // cria um elemento inserindo parametros
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  // aplica os parametros para criar os elementos
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const button = document.querySelectorAll('.item__add');
  button.forEach((btn) => btn.addEventListener('click', addItemToCart));
  return section;
}

const fetchProduct = async (search) => {
  // realiza a pesquisa na API do produto escolhido 
 const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
 const responseJson = await responseRaw.json();
 return responseJson.results;
};

const loadElements = async (search) => {
  // carrega lista de itens
  const listItems = document.querySelector('.items');
  listItems.innerHTML = '';
  whileLoading();
  const result = await fetchProduct(search);
  result.forEach(({ id, title, thumbnail }) => listItems
    .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
  removeLoading();
};

const createTagTotalPrice = () => {
  // cria a tag preço total ao carregar a página
  const totalPrice = document.createElement('span');
  totalPrice.className = 'total-price';
  
  totalPrice.innerHTML = transformToBrl(cartPrice);
  const cart = document.querySelector('.cart');
  cart.appendChild(totalPrice);
};

const emptyCart = () => {
  // botao esvaziar carrinho
  const cart = document.querySelector(cartItemsClass);
  cart.innerHTML = '';
  const totalPrice = document.querySelector(totalPriceCart);
  cartPrice = 0;
  totalPrice.innerHTML = transformToBrl(cartPrice);
  localStorage.setItem('cartList', '');
  localStorage.setItem('totalPrice', 0);
};

const searchField = () => {
  // campo de pesquisa para usuário 
  const button = document.getElementById('search-button');
  const searchArea = document.getElementById('search-text');

  button.addEventListener('click', () => {
    loadElements(searchArea.value);
    searchArea.value = '';
  });

  searchArea.addEventListener('keyup', (key) => {
    if (key.key === 'Enter') {
      loadElements(searchArea.value);
      searchArea.value = '';
    }
  });
};

const emptyButton = () => {
  // adiciona eventlistener ao botao esvaziar carrinho
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', emptyCart);
};

window.onload = () => {
  emptyButton();
  loadElements('computador'); // parametro inicial obrigatório do projeto é 'computador'
  searchField();
  loadCartFromStorage();
  createTagTotalPrice();
};