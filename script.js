const cart = '.cart__items';

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

// 4
const saveLocal = () => {
  localStorage.setItem('lista', document.querySelector(cart).innerHTML);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// 3
// função para remover item carrinho, clicando
// https://developer.mozilla.org/en-US/docs/Web/API/Element/remove */
function cartItemClickListener(event) {
  event.target.remove();
  saveLocal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 4
const loadLocal = () => {
  const items = localStorage.getItem('lista');
  document.querySelector(cart).innerHTML = items;
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

// 1
// Cria os itens
function achaProduto(params) {
  const itens = document.querySelector('.items');
  params.forEach((item) => itens.appendChild(createProductItemElement(item)));
}

// consegue informação da API 
const criaProduto = async (query) => {
  const loading = document.getElementById('loading');
  loading.innerText = 'loading...';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const requesicao = await fetch(endpoint);
  const resposta = await requesicao.json();
  loading.remove();
  
  achaProduto(resposta.results);
};

// 2
// funçao para adicionar o produto
function adicionaAoCarrinho(params) {
  document.querySelector('.cart__items').appendChild(createCartItemElement(params));
  saveLocal();
}

// função para pegar informaçoes do item clicado
const infoItem = async ({ target }) => {
  const itemId = getSkuFromProductItem(target.parentNode);
  const endpoint = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const response = await endpoint.json();
  
  adicionaAoCarrinho(response);
};

// função para o evento 'click' adicionar o item no carrinho
function botaoAdiciona() {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((add) => {
    add.addEventListener('click', infoItem);
  });
}

// 2
// const cartItem = async () => {
//   const botao = document.querySelectorAll('.item__add');
//   const carrinho = document.querySelector('.cart__items');
//   // Adiciona um listener para cada botao da minha lista de itens
//   botao.forEach((botaoCli) => { 
//     botaoCli.addEventListener('click', async (event) => {
//       const itemId = getSkuFromProductItem(event.target.parentElement);
//       const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
//       const requesicao = await fetch(endpoint);
//       const response = await requesicao.json();
//       // Adiciona informações do produto ao carrinho 
//       const itens = { 
//         sku: response.id,
//         name: response.title,
//         salePrice: response.price };
//       carrinho.appendChild(createCartItemElement(itens));
//     });
//   });
// };

// 6 limpa carrinho

// const limpaCarrinho = document.querySelector('.empty-cart');
// limpaCarrinho.addEventListener('click', () => {
//   listaCarrinho.innerHTML = '';
// });

window.onload = async () => { 
  await criaProduto('computador');
  await botaoAdiciona();
  await loadLocal();
};
