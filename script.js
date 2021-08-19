const cartItems = '.cart__items';

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

// 4 - Adicionando no LocalStorage Verificar que nao esta funcionando
function setStorage() {
  const listOl = document.querySelector(cartItems);
 localStorage.setItem('carrinho', JSON.stringify(listOl.innerHTML));
}

// somando o valor total do carrinho - verificar a logica depois.
function valorTotalCarrinho() {
  let soma = 0;
  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => {
    const valorItem = item.innerText.split('$')[1];
    soma += parseFloat(valorItem);
  });
  console.log(soma);
  const totalPrice = document.getElementsByClassName('total-price')[0];
  totalPrice.innerText = `${soma}`;
  localStorage.setItem('valor', JSON.stringify(soma));
}

function cartItemClickListener(event) {
  const itemRemover = event.target;
  // console.log(event.target.innerText);
  itemRemover.remove();
  setStorage();
  valorTotalCarrinho();
 }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // valorTotalCarrinho(salePrice); // enviando o valor para o total do carrinho
  
  return li;
}

function addCarrinho(idItem) {
  // console.log(idItem);
  const itemId = createCartItemElement( // envia os parametros do id do item recebido para a função createCartItemElement
    { sku: idItem.id, 
      name: idItem.title, 
      salePrice: idItem.price,
    },
  );
  const listaOl = document.querySelector(cartItems);
    const itemCarrinho = listaOl;
    itemCarrinho.appendChild(itemId);
    setStorage();
    valorTotalCarrinho();
}
// 2
const fetchItens = async (itemId) => {
  // console.log(itemId);
  const fetchItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const responseItem = await fetchItem.json();
  // console.log(responseItem);
  addCarrinho(responseItem);
  return responseItem;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
 const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
 // btnAdd.addEventListener('click', addCarrinho);
  btnAdd.addEventListener('click', () => {
    fetchItens(sku);
    // console.log(event.target);
    // console.log(sku);
  });
  section.appendChild(btnAdd);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function loading() {
  const container = document.querySelector('.container');
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading';
  container.appendChild(span);
  console.log('sendo chamado!');
}
const removeLoading = () => document.getElementsByClassName('loading')[0].remove();

const fetchApi = async () => {
  loading();
  const produto = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${produto}`;
  const response = await fetch(endpoint); // retorna uma promise
  const responseJson = await response.json(); // json retorna uma promise
  removeLoading();
  return responseJson.results;
    /* Estudo realizado junto com o Gustavo Dias - forma de explicar direfente de como verificar se a Promise esta tendo o retorno desejado. */
    // if (response.ok) { 
    //   const jsonResponse = await response.json();
    //  return jsonResponse;
    // }
};

const getProduto = async () => {
  const produtos = await fetchApi();
  const item = document.querySelector('.items'); 
  // pegando a classe e criando nossos elementos (produtos) com o forEach de baixo
  produtos.forEach((resul) => {
    item.appendChild(createProductItemElement(
      { 
        sku: resul.id, 
        name: resul.title,
        image: resul.thumbnail,
      },
      ));
  });
  // console.log(produtos.results);
};

// 6
function btnClear() {
  const btnClearCarrinho = document.getElementsByClassName('empty-cart')[0];
  btnClearCarrinho.addEventListener('click', () => {
    const ol = document.querySelector(cartItems);
    ol.innerText = '';
    localStorage.removeItem('carrinho');
    const totalPrice = document.getElementsByClassName('total-price')[0];
    totalPrice.innerText = '$: 0';
  });
}

function getStorage() {
  const listOl = document.querySelector(cartItems);
  listOl.innerHTML = JSON.parse(localStorage.getItem('carrinho'));
  const li = document.querySelectorAll('.cart__item');
 li.forEach((item) => item.addEventListener('click', cartItemClickListener));

 const soma = document.querySelector('.total-price');
 soma.innerHTML = JSON.parse(localStorage.getItem('valor'));
}

window.onload = () => { 
  fetchApi();
  getProduto();
  btnClear();
  getStorage();
};
