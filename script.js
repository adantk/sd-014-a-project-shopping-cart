const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
// Sessao dedicada à busca do fetch para o requisito 1 e 2
const fetchItems = async (type = 'sites/MLB/', element = 'search?q=computador') =>
  fetch(`https://api.mercadolibre.com/${type}${element}`)
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
// função feita apenas para dar apend em elementos
const appendChilds = (parent, element) => parent.appendChild(element);
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
  console.log(getSkuFromProductItem(event.target.parentNode));

  // cartItems.appendChild(event.target.parentNode);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buttonEventListener(callback) {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((e) => e.addEventListener('click', callback));
}
async function getItemsFromAPI() {
  try {
    const array = await fetchItems();
    const arrayMap = formatMap(array);
    arrayMap.forEach((elem) => appendChilds(items, createProductItemElement(elem)));
    buttonEventListener(cartItemClickListener);
  } catch (error) {
    console.log(error);
  }
}
window.onload = () => { getItemsFromAPI(); };
