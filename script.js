const getPriceForElement = (elementsCart) => { // essa função acessa o price do item acessando por elementoHtml
  let priceTotalNumber = 0;
  elementsCart.forEach((element) => {
  const priceNumber = parseFloat(element.innerText.split('$')[1]);
  priceTotalNumber += priceNumber;
  });
return priceTotalNumber;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const updatePriceTotalCart = () => { 
  const elementoPriceTotal = document.querySelector('.total-price');
  const elementsLiCart = document.querySelectorAll('.cart__item');
  elementoPriceTotal.innerText = `${getPriceForElement(elementsLiCart)}`;
};

const updateCartStorage = (elementForAddCart) => { 
  const elementoPriceTotal = document.querySelectorAll('.total-price');
  localStorage.setItem('olCart', elementForAddCart.innerHTML);
  localStorage.setItem('totalPriceCart', getPriceForElement(elementoPriceTotal));
};

function createCartItemElement(ObjetoParametro, elementoPaiLi) { // segundo parametro é o proprio elemento pai desse elemento, que sera usado para adicionar um addeventlistener 
  const { id: sku, title: name, price: salePrice } = ObjetoParametro;
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', ((event) => { 
    elementoPaiLi.removeChild(event.target);
    updatePriceTotalCart();
    updateCartStorage(elementoPaiLi);   
  }));
  return li;
}

async function fetchItemBySku(sku) { //
  const urlForFetch = `https://api.mercadolibre.com/items/${sku}`;
  const response = await fetch(urlForFetch).then((resposta) => resposta);
  const responseJson = await response.json();
  const elementOlCart = document.querySelector('.cart__items');
  elementOlCart.appendChild(createCartItemElement(responseJson, elementOlCart));
  updatePriceTotalCart();
  updateCartStorage(elementOlCart);
}

const ItemClickAddCart = (event) => {
  const elementoItemAdd = event.target.parentElement;
  const skuItemAdd = getSkuFromProductItem(elementoItemAdd);
  fetchItemBySku(skuItemAdd);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', ItemClickAddCart);
  }
  return e;
}

const renderLoanding = (startOrStop, elementAppend) => {
  (startOrStop === 'start')?
  elementAppend.appendChild(createCustomElement('h2', 'loading', 'Carregando...'))
  :
    elementAppend.removeChild(document.querySelector('.loading'));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

async function FilterFetch(url, chave) { // filtra saida do fetch em json por chave retornando um valor
  const response = await fetch(`${url}`);
  const data = await response.json();
  return data[chave];
}

async function requestionApiMl(valorBusca) {
  const elementItems = document.querySelector('.items');
  renderLoanding('start', elementItems);
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${valorBusca}`;
  const ItensResults = await FilterFetch(url, 'results'); // array com todos resultados de acordo com valorBusca 
  renderLoanding('stop', elementItems);
  ItensResults.forEach((item) => {
    const {
      id,
      title: nameItem,
      thumbnail: ImgItem,
    } = item;
    elementItems.appendChild(createProductItemElement(id, nameItem, ImgItem));
  });
}

const escutadorLiCarts = (elements, elementoPai) => { // função para atualizar escutador após carregar o carinho pelo storage.
  elements.forEach((element) => { 
    element.addEventListener('click', (event) => { 
      elementoPai.removeChild(event.target);
      updatePriceTotalCart();
      updateCartStorage(elementoPai);
    });
  });
};

function renderClearCartStorage(ItensCart) { // essa função se nao for passado um parametro limpa o carrinho, os parametros são as chaves que irá carregar
  const elementsOlCart = document.querySelector('.cart__items');
  elementsOlCart.innerHTML = localStorage.getItem(ItensCart);
  const elementsLiCart = document.querySelectorAll('.cart__item');
  escutadorLiCarts(elementsLiCart, elementsOlCart);
  updatePriceTotalCart();
  updateCartStorage(elementsOlCart);
}

function buttonClearCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    renderClearCartStorage();
  });
}

window.onload = () => {
  renderClearCartStorage('olCart');
  buttonClearCart();
  requestionApiMl('computador');
};