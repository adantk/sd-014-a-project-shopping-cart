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

const ol = document.querySelector('.cart__items');

function somaValor() {
  let total = 0;
  const liLista = document.querySelectorAll('li.cart__item');
  liLista.forEach((li) => {
    const price = parseFloat(li.innerText.split('$')[1]);
    total += price;
  });
  const valorTotal = document.querySelector('.total-price');
  valorTotal.innerText = total;
}

function cartItemClickListener(event) { 
  // Requisito 3
  event.target.remove();
  localStorage.lista = ol.innerHTML;
  somaValor();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 6
function esvaziarCarrinho() {
  const btnEsvaziar = document.querySelector('.empty-cart');
  btnEsvaziar.addEventListener('click', () => {
    document.querySelectorAll('li.cart__item').forEach((li) => li.remove());
  });
}

// Requisito 2
function adicionarAoCarrinho() {
  const buttonsAdd = document.querySelectorAll('.item__add');
  if (localStorage.lista) ol.innerHTML = localStorage.lista; 
  buttonsAdd.forEach((button) => {
    button.addEventListener('click', (event) => {
      const sku = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((response) => response.json()
      .then((objeto) => {
        const informacoes = { sku: objeto.id, name: objeto.title, salePrice: objeto.price };
        ol.appendChild(createCartItemElement(informacoes));
        localStorage.lista = ol.innerHTML;
        somaValor();
      }));
    });
  });
}

// Requisito 1 - Ajuda de Fernando Oliveira
function adicionarInfos() {
  const itemSection = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()
    .then((objeto) => {
      // carregamentoPagina();
      objeto.results.forEach((elemento) => {
        const informacoes = { sku: elemento.id, name: elemento.title, image: elemento.thumbnail };
        itemSection.appendChild(createProductItemElement(informacoes));
      });
    }))
    .then(() => adicionarAoCarrinho())
    .then(() => esvaziarCarrinho());
}

function adicionaListenerAoCarrinho() {
  ol.addEventListener('click', cartItemClickListener);
}

// function carregamentoPagina() {
//   const container = document.querySelector('.container');
//   const loading = document.createElement('p');
//   loading.classList('loading');
//   loading.innerText = 'Loading...';
//   container.appendChild(loading);
// }

// carregamentoPagina();

window.onload = async () => {
  await adicionarInfos();
  await adicionarAoCarrinho();
  adicionaListenerAoCarrinho();
  somaValor();
};
