const itemCarrinho = '.cart__items';

function carregando() {
  const carrega = document.querySelector('.loading');
  carrega.remove();
}

function salvarLs() {
  const itemsCarro = document.querySelector(itemCarrinho).innerHTML;
  localStorage.setItem('carrinho', itemsCarro);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const precoTotal = () => {
  const precoCarrinho = document.createElement('span');
  const carrinho2 = document.querySelector('.cart');
  precoCarrinho.className = 'total-price';
  carrinho2.appendChild(precoCarrinho);
};

const addPreco = async () => {
  const itemsCarrinho = document.querySelectorAll('.cart__item');
  let adicao = 0;
  itemsCarrinho.forEach((item) => {
  const num = item.innerText.split('$')[1];
  adicao += parseFloat(num);
  });
  const preco = document.querySelector('.total-price');
  preco.innerText = adicao;
};

function cartItemClickListener(event) {
  event.target.remove();
  addPreco();
  salvarLs();
} 

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  return li;
}

const fetchMl = async () => {
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
  const { results } = responseJson;
  const items = document.querySelector('.items');

  results.forEach((product) => {
    const infosProduct = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    items.appendChild(createProductItemElement(infosProduct));
  });
  carregando();
};

const fetchId = async (ids) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${ids}`);
  const responseJson = await responseRaw.json();
  const { id, title, price } = responseJson;
  const carrinho = document.querySelector(itemCarrinho);
  carrinho.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));    
  addPreco();
  salvarLs();
};

const eventoBotao = () => {
  const todosBotoes = document.querySelectorAll('.item__add');
  todosBotoes.forEach((botao) => botao.addEventListener('click', (event) => {
    fetchId(event.target.parentElement.firstChild.innerText);
  }));
};

const limpaCarrinho = () => {
  const ol = document.querySelector('.cart__items');
  const botaoLimpar = document.querySelector('.empty-cart');
 botaoLimpar.addEventListener('click', () => {
    ol.innerHTML = '';
    addPreco();
    salvarLs();
  });  
};

function carregarLs() {
  const itemsCarro2 = document.querySelector(itemCarrinho);
  itemsCarro2.innerHTML = localStorage.getItem('carrinho');
  itemsCarro2.addEventListener('click', ((event) => {
    if (event.target.classList.contains(itemCarrinho)) {
      cartItemClickListener(event);
    }
  }));
}

window.onload = async () => { 
  await fetchMl();
  await eventoBotao();
  await precoTotal();
  await limpaCarrinho();
  await carregarLs();
  };