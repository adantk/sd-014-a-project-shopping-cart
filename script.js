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
  // coloque seu código aqui
}

// adiciona pesquisa na página
const addMySearch = (resultados) => {
  const myContainer = document.querySelector('.items');
  resultados.forEach((item) => myContainer.appendChild(createProductItemElement(item)));
}

// busca api
const getMercadoList = async (query) => {
  const myEndPoint =  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const myInfo = await myEndPoint.json();
 
  addMySearch(myInfo.results);
}

const myCart = document.querySelector('.cart__items');

// adiciona produto
const addToMyCart = (product) =>{
  document.querySelector('.cart__items').appendChild(createCartItemElement(product));
}

// pega info daquele item clicado
const getMercadoItem = async ( { target }) => {
  const myItemID = getSkuFromProductItem(target.parentNode);
  // alert(myItemID);
  const myResponse = await fetch(`https://api.mercadolibre.com/items/${myItemID}`);
  const myInfo = await myResponse.json();
  addToMyCart(myInfo);
}

// trigger para adicionar
const addToCartButtons = () => {
  const myButtons = document.querySelectorAll('.item__add');
  myButtons.forEach((btAdd) => {
    btAdd.addEventListener('click', getMercadoItem);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = async () => {
  await getMercadoList('computador');
  addToCartButtons();
};
