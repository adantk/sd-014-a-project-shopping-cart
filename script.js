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

// adiciona id para que titulo, foto e id se tornem visiveis 
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

const cart = document.querySelector('.cart__items');

const cartSave = () => {
  localStorage.clear();
  localStorage.setItem('cartList', cart.innerHTML);
};

// remove o item do carrinho de compras ao ser clicado (o alvo do evento é removido) 
function cartItemClickListener(event) {
  event.target.remove();
  cartSave();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adiciona os dados em json e criar a partir de um for each o conteudo ".items"
// note to self: colocada antes da fetchApi para que a linha dataAdd(data.results) funcione
const dataAdd = (results) => {
  const itemContainer = document.querySelector('.items');
  results.forEach((item) => itemContainer.appendChild(createProductItemElement(item)));
};

// faz a busca da API; conceito de async/await para evitar o uso de .then
const fetchApi = async (query) => {
  const endPoint = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await endPoint.json();
  dataAdd(data.results);
};

//  adiciona ao carrinho o produto usando createCartItemElement proposto pelo requisito
const cartAddProduct = (product) => {
  document.querySelector('.cart__items').appendChild(createCartItemElement(product));
  cartSave();
};

// usa o {target} para captar o id do produto selecionado, mesmo principio do fetchApi 
// async pois é necessário que ela rode independente e pela boa pratica de um codigo mais limpo
const itemId = async ({ target }) => {
  const id = getSkuFromProductItem(target.parentNode);
  const data = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const info = await data.json();
  cartAddProduct(info);
};

// comando de ação para as duas funções auxiliares
const addButtons = () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((addButton) => {
    addButton.addEventListener('click', itemId);
  });
};

const cartLoad = () => {
  cart.innerHTML = localStorage.getItem('cartList');
};

// fetchApi seguindo padrao do requisito ('computador')
window.onload = async () => { 
  await fetchApi('computador');
  addButtons();
  cartLoad();
};
