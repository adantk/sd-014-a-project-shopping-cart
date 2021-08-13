const itens = document.querySelector('.items');
const listaCarrinho = document.querySelector('.cart_items');
const botaoAdiciona = document.querySelectorAll('.item__add');

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

function cartItemClickListener(event) {
  listaCarrinho.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function achaProduto(params) {
  params.forEach((item) => itens.appendChild(createProductItemElement(item)));
}

// consegue informação da API e cria os itens
const criaProduto = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const requesicao = await fetch(endpoint);
  const resposta = await requesicao.json();

  achaProduto(resposta.results);
};

function addParaCarrinho(params) {
  listaCarrinho.appendChild(createProductItemElement(params));
}
// consegue a informação do item clicado no site
const pegaItem = async ({ target }) => {
  const myItemID = getSkuFromProductItem(target.parentNode);
  const endpoint = `https://api.mercadolibre.com/items/${myItemID}`;
  const requesicao = await fetch(endpoint);
  const resposta = await requesicao.json();

  addParaCarrinho(resposta);
};

// agora para adicionar ao carrinho com um click
function adiCarriBotao() {
  botaoAdiciona.forEach((addBt) => {
    addBt.addEventListener('click', pegaItem);
  });
}

window.onload = async () => { 
  await criaProduto();
  adiCarriBotao(); 
};
