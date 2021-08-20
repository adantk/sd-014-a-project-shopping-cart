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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adiciona os dados em json e criar a partir de um for each o conteudo ".items"
// note to self: colocada antes da fetchApi para que a linha dataAdd(data.results) funcione
const dataAdd = (results) => {
  const itemContainer = document.querySelector('.items');
  results.forEach((item) => itemContainer.appendChild(createProductItemElement(item)));
};

// faz a busca da API; conceito de async/await para evitar o uso de .then
const fetchApi = async (query) => {
  const endPoint = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await endPoint.json();
  dataAdd(data.results);
};

// fetchApi seguindo padrao do requisito ('computador')
window.onload = () => { 
  fetchApi('computador');
};
