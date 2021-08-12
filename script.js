const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
// função feita apenas para dar apend em elementos
const appendChilds = (parent, element) => parent.appendChild(element);
// escutador de eventos dos botoes da lista, chamado apenas depois da criação na função assincrona
function buttonEventListener(callback) {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((e) => e.addEventListener('click', callback));
}
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
async function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function buttonListener(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const array = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json());
  // console.log(array);
  const arrayObj = {
    sku: array.id,
    name: array.title,
    salePrice: array.price,
  };
  appendChilds(cartItems, createCartItemElement(arrayObj));
}

// Sessao dedicada à busca do fetch para o requisito 1
const fetchItems = async (element = 'computador') =>
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${element}`)
    .then((response) => response.json())
    .then((response) => response.results)
    .catch(() => { throw new Error('API retornou erros'); });
// .then((e) => console.log(e));
// Função dedicada à transformação da resposta da fetch para estar nos moldes dos criadores
const formatMap = (arr, lastKey = 'image', thing = 'thumbnail') => arr.map((elem) => ({
  sku: elem.id,
  name: elem.title,
  [lastKey]: elem[thing],
}));
async function getItemsFromAPI() {
  try {
    const array = await fetchItems();
    const arrayMap = formatMap(array);
    arrayMap.forEach((elem) => appendChilds(items, createProductItemElement(elem)));
    buttonEventListener(buttonListener);
  } catch (error) {
    console.log(error);
  }
}
window.onload = () => { getItemsFromAPI(); };
