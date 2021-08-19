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

async function cartItemClickListener(event) {
  const itemSelect = document.querySelector('.cart__items');
  itemSelect.removeChild(event.target);
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
  const dados = await response.json();
  dados.results.forEach((dado) => {
    const sectionItem = document.querySelector('.items');
    const element = createProductItemElement(dado);
    sectionItem.appendChild(element);    
  }); 
}

async function consultaItem(product) {
  const response = await fetch(`https://api.mercadolibre.com/items/${product}`);
  const dados = await response.json();
  await createCartItemElement(dados);
  // await somaItemsDoCarrinho(dados);
}

async function objetoSelecionado() {
  const todosItems = document.querySelector('.items');
  todosItems.addEventListener('click', (event) => {
    const product = getSkuFromProductItem(event.target.parentElement);
    consultaItem(product);
  });
}

async function limparCarrinho() {
  const botaoDeLimpar = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  botaoDeLimpar.addEventListener('click', (e) => {
    ol.innerText = '';
  })
}

// async function somaItemsDoCarrinho({price: salePrice}) {
//   console.log(salePrice);
//   const localDaSoma = document.getElementsByTagName('input');
//   lo
// }
// async function addItemLocalStorage() {
//   const ol = document.querySelector('.cart__items');
//   localStorage.setItem('item', ol.innerHTML);
// }

// async function removeLocalStorage() {
//   const ol = document.querySelector('.cart__items');
//   localStorage.clear()
// }

// function storage() {
//   const ol = document.querySelector('.cart__items');
//   if (localStorage !== null) {
//     ol.innerText = localStorage.item;
//   }
// }

window.onload = async () => {
  await consultApi();
  await objetoSelecionado();
  await limparCarrinho();
};
