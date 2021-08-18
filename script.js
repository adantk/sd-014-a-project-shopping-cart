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
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);  
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

// console.log(botao);

const getAPIItem = async (itemID) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const responseJson = await responseRaw.json();
  return responseJson;
};

const adicionaItem = () => {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((botao) => botao.addEventListener('click', async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  const dadosApi = await getAPIItem(itemID);
  const resultado = createCartItemElement(dadosApi);
  const ol = document.querySelector('.cart__items');
  console.log(resultado);
  ol.appendChild(resultado);
  }));
};

window.onload = async () => { 
  await getProducts('computador');
  adicionaItem();
};
