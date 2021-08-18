const classList = document.querySelector('.items');
const body = document.querySelector('body');
const cartList = document.querySelector('.cart__items');
const btnCleanCart = document.querySelector('.empty-cart');
const nam = 'Sum-prices'; // coloquei em uma const, pq repetiu mais de 3x e o lint reclamou
const span = document.createElement('span');
const p = document.querySelector('.p');
span.className = 'total-price';
span.innerText = 0; // O texto inicial p/ aparecer com 0
p.appendChild(span);
let somaValues = Number(localStorage.getItem('Sum-prices')); // Transformei em number pois o localStorage retorna uma string

 function createSumElement(valor) {
  somaValues += valor;
  span.innerText = Math.round(somaValues * 100) / 100;
  localStorage.setItem(nam, Math.round(somaValues * 100) / 100);
} 
// Função para remover o elemento clicavel da lista, 1 a 1.
function cartItemClickListener(event) {
  const justValueLi = event.target.innerHTML.split('$')[1];
  somaValues -= justValueLi;
  span.innerText = Math.round(somaValues * 100) / 100;
  localStorage.setItem(nam, Math.round(somaValues * 100) / 100);
  return cartList.removeChild(event.target);
}
// Salvo no localStorage todos os li's dentro do carrinho através do innerHTML do elemento pai
function saveLocalStorage() {
  localStorage.clear();
  localStorage.setItem('list_products', cartList.innerHTML);
}
// Pego essas informações salvas e adciono no innerHTML do elemento pai e dps salvo novamente com as mudanças
function getLocalStorage() {
  cartList.innerHTML = localStorage.getItem('list_products');
  if (localStorage.getItem(nam)) { // se o localStorage tiver salvo, retorna o valor dele
    span.innerText = localStorage.getItem(nam);
  } else {
    span.innerText = 0; // caso não retorna 0
  }
  cartList.childNodes.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);  
  });
}
// Função que add imagem e classe aos elementos da lista
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Função que add nome e classe aos elementos da lista
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Função já veio pronta que cria a estrutura de cada um dos elementos da lista
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// Função já veio pronta, mas acabei não usando
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// Função já veio pronta só add o savelocalstorage cada vez que uma li é criada
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveLocalStorage();
  return li;
}
// Quando clica no botão esvaziar carrinho ele limpa todos os li's passando um vazio para o elemento pai e limpa todo o localStorage salvo.
const cleanCartAll = () => {
    btnCleanCart.addEventListener('click', () => {
      somaValues = 0;
      localStorage.clear();
      cartList.innerHTML = '';
      span.innerHTML = 0;
 });
};
// Cria uma função que serve pra acessar o endpoint do ID do elemento passado como parametro
const fecthID = async (endpoint) => {
 const responseRaw = await fetch(`https://api.mercadolibre.com/items/${endpoint}`);
 const responseJson = await responseRaw.json();
 return responseJson;
};
// Quando clico no botão adionar ao carrinho, adciona ao carrinho como filho de ol, contendo as informações SKU, name, salePrice
const cartClick = () => {
  const buyButton = document.querySelectorAll('.item__add');
  buyButton.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const sku = getSkuFromProductItem(event.target.parentNode);
      fecthID(sku).then((response) => {
        const appendCart = createCartItemElement({ 
          sku: response.id,
          name: response.title, 
          salePrice: response.price });
         cartList.appendChild(appendCart); 
         saveLocalStorage();
         createSumElement(response.price);
      });
    });
  });
};
// Puxa da api com endpoint computadores e cria uma lista deles com id,nome e imagem.
const listJsonMercadoLivre = async (endpoint) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${endpoint}`;
  const response = await fetch(url);
  const request = await response.json();
  const resultList = await request.results;
  resultList.map((list) => {
    const store = createProductItemElement({
      sku: list.id,
      name: list.title,
      image: list.thumbnail });
    return classList.appendChild(store);
  });
  const h = document.querySelector('h1');
  body.removeChild(h);
  cartClick();
};

function textLoading() {
  const h = document.createElement('h1');
  h.className = 'loading';
  h.innerText = 'Loading...';
  body.appendChild(h);
}

window.onload = async () => {
  textLoading();
  await listJsonMercadoLivre('computador');
  cleanCartAll();
  getLocalStorage();
};
