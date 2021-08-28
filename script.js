const ol = document.querySelector('.cart__items');

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const createLoading = () => {
  document.body.appendChild(createCustomElement('h1', 'loading', 'loading...'));
};
const deleteLoading = () => {
  document.querySelector('.loading').remove();
};

const calculator = {
  add: (valor, total) => Math.round((valor + total) * 100) / 100,
  sub: (valor, total) => Math.round((total - valor) * 100) / 100,
};

const precoAtualizado = (callback, price) => {
  let valorInit = 0;
  const elementosOl = document.querySelectorAll('.cart__item');
  const totalText = document.querySelector('.total-price');
  elementosOl.forEach((elemento) => {
    valorInit = calculator.add(parseFloat(elemento.innerText.split('$')[1]), valorInit);
  });
  totalText.innerHTML = callback(price, valorInit);
};// Ajuda dos colegas!!!

document.querySelector('.empty-cart').addEventListener('click', () => {
  ol.innerHTML = '';
  precoAtualizado(calculator.add, 0);
  localStorage.removeItem('carrinho');
});

function cartItemClickListener(e) {
  precoAtualizado(calculator.sub, (parseFloat(e.innerText.split('$')[1])));
  e.remove();
  localStorage.setItem('carrinho', ol.innerHTML);
} // Ajuda dos colegas!!!

const abastecerCarrinho = () => {
  ol.innerHTML = localStorage.getItem('carrinho');
  ol.childNodes.forEach((el) => el.addEventListener('click', (e) =>
  cartItemClickListener(e.target)));
  precoAtualizado(calculator.add, 0);
};// Ajuda dos colegas!!!

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListenner('click', cartItemClickListener);
  li.addEventListener('click', (e) => cartItemClickListener(e.target));
  return li;
}
const urlApiID = 'https://api.mercadolibre.com/items/';
async function fetchApiID(id) {
  createLoading();
 return fetch(`${urlApiID}${id}`)
 .then((response) => response.json())
 .then((dados) => {
   ol.appendChild(createCartItemElement(dados)); // list add;
   localStorage.setItem('carrinho', ol.innerHTML); // Salvando no localStorage;
   precoAtualizado(calculator.add, 0);
}).then(() => deleteLoading());
}
const eventoButtonId = () => document.querySelectorAll('.item__add').forEach((button) => button
.addEventListener('click', (e) =>
fetchApiID(e.target.parentElement.firstChild.innerText)));

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

 // function getSkuFromProductItem(item) {
  // return item.querySelector('span.item__sku').innerText;
// }
 
const findApi = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const promiseFetchBusca = async (query) => {
  createLoading();
  return fetch(`${findApi}${query}`)
.then((response) => response.json()
.then((dados) => dados.results.forEach((element) =>
document.querySelector('.items').appendChild(createProductItemElement(element)))))
.then(() => eventoButtonId()).then(() => deleteLoading());
};

window.onload = () => { 
  promiseFetchBusca('computador');
  abastecerCarrinho();
};