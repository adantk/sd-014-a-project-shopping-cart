const ol = document.querySelector('.cart__items');
const empty = document.querySelector('.empty-cart');
const load = document.getElementsByClassName('loading');
const total = document.querySelector('.total-price');

function globalStorage(key, value) {
  localStorage.setItem(key, value);
}

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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image
}) { // feito para facilitar na linha 7, definindo como cada parametro representará na leitura da API
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return  item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  ol.removeChild(event.target);
  let num = Number(total.innerText);
  let count = Number(event.target.innerText.split('$')[1]);
  num -= count;
  total.innerText = num;
  globalStorage('price', total.innerText);
  globalStorage('cartItem',ol.innerHTML);
}

function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li'); // cria uma li 
  li.className = 'cart__item'; // com classe 'cart_item'
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  empty.addEventListener('click', () => {
    ol.innerHTML = '';
    total.innerText = 0;
    localStorage.clear();
});

const calculate = () => {
  const lista = document.querySelectorAll('.cart__item');
  const num = Number(total.innerText);
  let count = Number(lista[lista.length - 1].innerText.split('$')[1]);
  count += num;
  total.innerText = count;
  globalStorage('price', total.innerText);
}

const cartApi = async (search) => {
  const getEndPointForAdd = await `https://api.mercadolibre.com/items/${search}`;
  const getFetchForCart = await fetch(getEndPointForAdd);
  const getJsonForCart = await getFetchForCart.json();
  const jsonForSku = {
    sku: getJsonForCart.id,
    name: getJsonForCart.title,
    salePrice: getJsonForCart.price,
  }
  await ol.appendChild(createCartItemElement(jsonForSku));
  await calculate();
  globalStorage('cartItem',ol.innerHTML);
}

const addToCart = async () => {
  const btnAdd = document.querySelectorAll('.item__add'); // manipular o botão de adicionar 
  await btnAdd.forEach((btnAddCart) => { // para manipular todos os botões com forEach
    btnAddCart.addEventListener('click', (event) => { // adciona um escutador em cada um dos btn
     cartApi(getSkuFromProductItem(event.target.parentElement))
    })
  });
}

const apiCallBack = async () => { // async = funçao com sincronia, um espera o proximo
  const getEndPoint = await `https://api.mercadolibre.com/sites/MLB/search?q=computador`;
  const getFetch = await fetch(getEndPoint); // const para salvar o retorno do fetch
  const getJson = await getFetch.json();
  const itemsSelctor = document.querySelector('.items');
  await getJson.results.forEach((result) => { // para cada elemento Json da API
    itemsSelctor.appendChild(createProductItemElement(result)); // transforma um elemento em item na ul
  });
  await addToCart();
  const body = document.querySelector('body');
  const load = document.querySelector('.loading')
  await body.removeChild(load);
}

function getStorage() {
  ol.innerHTML = localStorage.getItem('cartItem')
  total.innerText = Number(localStorage.getItem('price'))
}

const localBtn = () => {
  const li = document.querySelectorAll('.cart__item');
  li.forEach((lista) => {
    lista.addEventListener('click', cartItemClickListener)
  });
}

window.onload = async () => {
  await apiCallBack();
  await getStorage();
  await localBtn();
};