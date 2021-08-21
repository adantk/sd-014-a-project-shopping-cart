const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const cart = document.querySelector('.cart');
const priceTag = document.createElement('span');
const spanTag = document.createElement('span');
const divLoading = document.createElement('div');
const buttonClearAll = document.querySelector('.empty-cart');
// função feita apenas para dar apend em elementos
const appendChilds = (parent, element) => parent.appendChild(element);
// escutador de eventos dos botoes da lista, chamado apenas depois da criação na função assincrona
// tambem é um escutador que é ativado apos a pagina ser recarregada, para poder eliminar elementos do localStorage
function buttonEventListener(classe, callback) {
  const buttons = document.querySelectorAll(classe);
  buttons.forEach((e) => e.addEventListener('click', callback));
}
// Função criada para salvar no localStorage a cada mudança
const saveLocalStorage = () => localStorage.setItem('shopCart', cartItems.innerHTML);
// função para o requisito 5, total price
const totalPrice = async () => {
  const cartItem = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartItem.forEach((e) => { sum += Number(e.id); });
  priceTag.className = 'total-price';
  sum = Math.round(sum * 100) / 100;
  priceTag.innerText = sum;
  spanTag.className = 'text-center';
  spanTag.innerHTML = 'O total é R$';
  appendChilds(spanTag, priceTag);
  appendChilds(cart, spanTag);
};
// Requisito 6
buttonClearAll.addEventListener('click', () => { 
  cartItems.innerHTML = '';
  totalPrice(); 
  saveLocalStorage();
}); 
// requisito 7
const loading = () => {
  divLoading.className = 'loading';
  divLoading.innerText = 'loading';
  appendChilds(items, divLoading);
};
// função ja dada
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
  event.target.remove();
  totalPrice();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Esta função é chamada quando qualquer botão da lista é criado, sua função é
// colher as informações atualizadas do item, criar através do createCartItemElement
// e dar append na parte destinada ao carrinho de compras
async function funcaoEscutadoraBottoes(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const array = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json());
  const arrayObj = {
    sku: array.id,
    name: array.title,
    salePrice: array.price,
  };
  appendChilds(cartItems, createCartItemElement(arrayObj));
  saveLocalStorage();
  totalPrice();
}
// Sessao dedicada à busca do fetch para o requisito 1
const fetchItems = async (element = 'computador') =>
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${element}`)
    .then((response) => response.json())
    .then((response) => response.results)
    .catch(() => { throw new Error('API retornou erros'); });
// Função dedicada à transformação da resposta da fetch para estar nos moldes dos criadores
const formatMap = (arr, lastKey = 'image', thing = 'thumbnail') => arr.map((elem) => ({
  sku: elem.id,
  name: elem.title,
  [lastKey]: elem[thing],
}));
async function getItemsFromAPI() {
  try {
    loading();
    const array = await fetchItems();
    const arrayMap = formatMap(array);
    divLoading.remove();
    arrayMap.forEach((elem) => appendChilds(items, createProductItemElement(elem)));
    buttonEventListener('.item__add', funcaoEscutadoraBottoes);
  } catch (error) {
    console.log(error);
  }
}
window.onload = () => { 
  getItemsFromAPI();
  if (localStorage.shopCart) {
    cartItems.innerHTML = localStorage.shopCart;
  }
  buttonEventListener('.cart__item', cartItemClickListener);
  totalPrice();
};