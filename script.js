const salvaDados = () => {
  const ols = document.querySelector('.cart__items').innerHTML; // conteudo da tag li
  // console.log(ols);
  // localStorage.clear();
  localStorage.setItem('lista', ols);
  // localStorage.getItem('lista');
};

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

const precoTotal = () => {
  const span = document.querySelector('.total-price');
  const conjuntoLi = document.querySelectorAll('.cart__item');
  let soma = 0;
  conjuntoLi.forEach((li) => {
    soma += Number(li.innerText.split('$')[1]);
    span.innerHTML = Math.round(soma * 100) / 100;
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  salvaDados();
  precoTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProducts = async (QUERY) => {
  const sectionItem = document.querySelector('.items');
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const responseJson = await responseRaw.json();
  responseJson.results.forEach((eleme) => sectionItem.appendChild(createProductItemElement(eleme)));
};

const getAPIItem = async (itemID) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const responseJson = await responseRaw.json();
  return responseJson;
};

// Recebi ajuda da Mayu - Turma 15 no requisito 02!
const adicionaItem = () => {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((botao) => botao.addEventListener('click', async (event) => {
  const itemID = await getSkuFromProductItem(event.target.parentElement);
  const dadosApi = await getAPIItem(itemID);
  const resultado = createCartItemElement(dadosApi);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(resultado);
  salvaDados();
  precoTotal();
  }));
};

const esvaziaCarrinho = () => {
  const botaoEsvazia = document.querySelector('.empty-cart');
  botaoEsvazia.addEventListener('click', () => {
    // const ol = document.getElementsByTagName('ol');
    // console.log(ol);
    // console.log(ol.children);
    const conjuntoLi = document.querySelectorAll('li');
    conjuntoLi.forEach((li) => li.remove());
    const span = document.querySelector('.total-price');
    span.innerHTML = 0;
  });
};

window.onload = async () => { 
  await getProducts('computador');
  adicionaItem();
  // Recebi ajuda do Filipe Brochier no requisito 04!
  const lista = document.getElementsByClassName('cart__items')[0]; // estrutura da tag 
  lista.innerHTML = localStorage.getItem('lista');
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((elemento) => elemento.addEventListener('click', cartItemClickListener));
  esvaziaCarrinho();
};
