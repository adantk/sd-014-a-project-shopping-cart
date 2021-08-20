const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';

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

function addItemLocalStorage() {
  const itens = document.querySelector('.carti_t');
  localStorage.setItem('item', itens.innerHTML);
}

async function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  await ol.removeChild(event.target);
  addItemLocalStorage();
}

async function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

async function consultApi() {
  const response = await fetch(`${url}computador`);
  const loading = document.querySelector('.loading');
  const dados = await response.json();
  dados.results.forEach((dado) => {
    const sectionItem = document.querySelector('.items');
    const element = createProductItemElement(dado);
    sectionItem.appendChild(element);
    loading.remove();
  }); 
}

async function consultaItem(product) {
  const response = await fetch(`https://api.mercadolibre.com/items/${product}`);
  const dados = await response.json();
  await createCartItemElement(dados);
  addItemLocalStorage();
}

async function objetoSelecionado() {
  const todosItems = document.querySelector('.items');
  todosItems.addEventListener('click', (event) => {
    const product = getSkuFromProductItem(event.target.parentElement);
    consultaItem(product);
    addItemLocalStorage();
  });
}

async function limparCarrinho() {
  const botaoDeLimpar = document.querySelector('.empty-cart');
  botaoDeLimpar.addEventListener('click', () => {
    const listaOrdenada = document.querySelector('#cart_it');
    listaOrdenada.innerText = '';
  });
}

function storage() {
  const lo = document.querySelector('.carti_t');
  lo.innerHTML = localStorage.getItem('item');
  lo.childNodes.forEach((liAtual) => liAtual.addEventListener('click', cartItemClickListener));
}

window.onload = async () => {
  await consultApi();
  await objetoSelecionado();
  await limparCarrinho();
  storage();
};
