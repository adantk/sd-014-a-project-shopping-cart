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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Cria os itens
function achaProduto(params) {
  const itens = document.querySelector('.items');
  params.forEach((item) => itens.appendChild(createProductItemElement(item)));
}

// consegue informação da API 
const criaProduto = async (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const requesicao = await fetch(endpoint);
  const resposta = await requesicao.json();

  achaProduto(resposta.results);
};
// 2
const cartItem = async () => {
  const botao = document.querySelectorAll('.item__add');
  const carrinho = document.querySelector('.cart__items');
  // Adiciona um listener para cada botao da minha lista de itens
  botao.forEach((botaoCli) => { 
    botaoCli.addEventListener('click', async (event) => {
      const itemId = getSkuFromProductItem(event.target.parentElement);
      const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
      const requesicao = await fetch(endpoint);
      const response = await requesicao.json();
      // Adiciona informações do produto ao carrinho 
      const itens = { 
        sku: response.id,
        name: response.title,
        salePrice: response.price };
      carrinho.appendChild(createCartItemElement(itens));
    });
  });
};

window.onload = async () => { 
  await criaProduto('computador');
  cartItem();
};
