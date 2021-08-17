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
// Questão 5
function totalSoma() {
  const totalPrices = document.createElement('li');
  const carrinho = document.querySelectorAll('.cart__item');
  let soma = 0;
  if (document.querySelector('.total-price')) {
    document.querySelector('.total-price').remove();
  }
  carrinho.forEach((item) => {
    const itemPrice = item.innerText.split('$')[1];
    soma += parseFloat(itemPrice);
  });
  totalPrices.className = 'total-price';
  totalPrices.innerText = `${soma}`;
  document.querySelector('.cart').appendChild(totalPrices);
};
// requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  totalSoma();
  localStorage.clear();
}

// Questao 2. resolvida.....
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criarBtn() {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((element) =>
    element.addEventListener('click', async (event) => {
      const carrinho = document.querySelector('.cart__items');
      const produtos = event.target.parentElement;
      const id = produtos.firstChild.innerText;
      const productApi = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const retornoJson = await productApi.json();
      carrinho.appendChild(createCartItemElement(retornoJson));
      totalSoma();
      localStorage.setItem('stored', carrinho.innerHTML);
    }));
};

//Resolvendo a questão 1.....
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItem = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  sectionItem.appendChild(section);
  return sectionItem;
}

const transJson = async () => {
  // resolvendo a 7
  const loading = createCustomElement('h1', 'loading', 'loading');
  loading.className = 'loading';
  document.body.appendChild(loading);
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador',)
  const responseJson = await responseRaw.json();
  const arrayRates = responseJson.results;

  arrayRates.forEach((product) => {
    createProductItemElement(product);
  });
  criarBtn();
  loading.remove();
};

// requisito 4.
function localstorage() {
  if (localStorage.getItem('stored')) {
    document.querySelector('.cart__items').innerHTML
      += localStorage.getItem('stored');
    totalSoma();
  }
};
// Requisito 6....
function limpaCarrinho() {
  const carrinho = document.querySelectorAll('.cart__item');
  for (let index of carrinho) {
    index.remove();
    localStorage.clear();
  }
  totalSoma();
};

window.onload = async () => {
  transJson();
  localstorage();
  document.querySelector('.empty-cart').addEventListener('click', limpaCarrinho);
};