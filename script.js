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

// listagem de produtos
const sectionItem = document.getElementsByClassName('item');
const listproduct = (product) => {
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  sectionItem.appendChild(ul);
  ul.appendChild(li);
  li.innerText = product;
};

function createProductItemElement({ id: sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

sectionItem.appendChild(createProductItemElement);

  // api
const fetchFreeMarketAsync = async (QUERY) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const responseJson = await responseRaw.json();
  const arrayResults = Object.entries(responseJson.results);
  arrayResults.forEach((element) => listproduct(element));
  console.log(arrayResults);
};

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

<<<<<<< HEAD
const fetchFreeMarketAsync = async (QUERY) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const responseJson = await responseRaw.json(); // my object
  const arrayResults = responseJson.results; // produtos
  const listItens = document.querySelector('.items');
  arrayResults.forEach((product) => {
    const infosOfObject = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
  listItens.appendChild(createProductItemElement(infosOfObject));
});
};

// const btnAddCarAsync = async (ItemID)

window.onload = () => { 
  fetchFreeMarketAsync('computador');
};
// pega id - pelo botao
// clicar pega id do botao - do elemento 
// procurar id para usar no fect do requisito
=======
const ol = document.getElementsByClassName('cart__items');
ol.appendChild(createCartItemElement);

const buttonAddproduct = () => {
  const btn = document.createElement('button');
  ol.appendChild(btn);
  btn.id = 'btn-Add';
  const btnAdd = document.getElementById('btn-Add');
  btnAdd.innerText = 'Adicionar ao carrinho';
  btnAdd.addEventListener('click', () => {

  addCarFreeMarketAsync();
  });
  
};

const addCarFreeMarketAsync = async (ItemID) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const responseJson = await responseRaw.json();
  const arrayId = Object.entries(responseJson.id);
  arrayId.forEach((element) => listproduct(element));
  console.log(arrayId);
};

window.onload = async () => { 
  await fetchFreeMarketAsync('computador');
  createCartItemElement();
};
>>>>>>> 7056a5d6b998781ac6a2db022f8e8c8c58a6e09a
