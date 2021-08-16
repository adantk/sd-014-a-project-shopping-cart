// inicializando projeto
const olItens = document.querySelector('.cart__items');
const sectionItens = document.querySelector('.items');
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
  olItens.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// inicio do projeto

const getResultsForCart = async (product) => {
  const resultAPI = await fetch(`https://api.mercadolibre.com/items/${product}`);
  const resultCpmplete = await resultAPI.json();
  olItens.appendChild(createCartItemElement({
    sku: resultCpmplete.id,
    name: resultCpmplete.title,
    salePrice: resultCpmplete.price,
  }));
  cartItemClickListener();
};

const buttonAddCart = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((ele) => ele.addEventListener('click', (event) => {
    getResultsForCart(event.target.parentElement.firstChild.innerText);
  }));
};

// função assincrona para conectar com a API e pegar os resultados desejados
const getResultsFromAPI = async (search) => {
  const itemsAPI = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
  // pega uma chave específica.
  const responseItemsAPI = await itemsAPI.json();
  // passar por cada elemento retonado do responseItemsAPI
  responseItemsAPI.results.forEach((element) => {
    // guardando o retono do forEach e chamando a função para criar a estrutura dos itens na pagina
    const returnEle = createProductItemElement(element);
    // criando dimanicamente os elementos na página dentro da section items
    sectionItens.appendChild(returnEle);    
  });
  buttonAddCart();
};

window.onload = () => { 
  getResultsFromAPI('computador');
};
