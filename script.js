const cart = document.querySelector('.cart__items');
const sum = document.querySelector('.total-price');

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

// salva o keyvalue cartList e o conteudo relevante para o localStorage
// o .clear serve para não existir um acumulo de informações
const cartSave = () => {
  localStorage.clear();
  localStorage.setItem('cartList', cart.innerHTML);
};

// utiliza o conceitto de reduce para fazer a contagem com valores Number, usando o split para captar somenet o valor numerico
function sumPrice() {
  const price = [...document.querySelectorAll('li.cart__item')]
  .reduce((acc, curr) => Number(curr.innerText.split('$')[1]) + acc, 0);
  // Math.round(price * 100) / 100; faz com que o valor seja arrendondo com duas casas decimais
  sum.innerText = Math.round(price * 100) / 100;
}

// remove o item do carrinho de compras ao ser clicado.
// funciona para todos os items colocados na seção atual, ou seja items salvos do LocalStorage não são deletados.
async function cartItemClickListener(event) {
  event.target.remove();
  cartSave();
  sumPrice();
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
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading...';
  const endPoint = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await endPoint.json();
  loading.remove();
  dataAdd(data.results);
};

//  adiciona ao carrinho o produto usando createCartItemElement proposto pelo requisito
const cartAddProduct = (product) => {
  cart.appendChild(createCartItemElement(product));
  cartSave();
  sumPrice();
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

// cria o localStorage dos produtos já adicionados
// adiciona eventListener ao clicar,
// tornando a cartItemClickListener operante nos produtos salvos no localStorage
const cartLocalStorage = () => {
  cart.innerHTML = localStorage.getItem('cartList');
  const cartProducts = document.querySelectorAll('.cart__item');
  cartProducts.forEach((product) => {
    product.addEventListener('click', cartItemClickListener);
  });
};

// Ao clicar no botao esvaziar carrinho ele altera o innerHTML para vazio
// chama a funcao sumPrice para que o valor do antigo carrinho nao permaneça depois de esvaziado
const clearAll = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    cart.innerHTML = '';
    cartSave();
    sumPrice();
  });
};

// fetchApi seguindo padrao do requisito ('computador')
window.onload = async () => { 
  await fetchApi('computador');
  await cartLocalStorage();
  await sumPrice();
  addButtons();
  clearAll();
};
