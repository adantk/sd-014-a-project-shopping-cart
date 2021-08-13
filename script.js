const updateCartStorage = (elementForAdd) => { 
  localStorage.setItem('olCart', elementForAdd.innerHTML);
};


const getPriceForElement = (elementsCart) => { // essa função extra o price do item acessando por elementoHtml
  let priceTotalNumber = 0;
  elementsCart.forEach(element => { 
    const elementValue = element.innerText;
    const elementsItensCart = elementValue.split(' ');// quebra a string removendo os espaços 
    const priceElement = elementsItensCart[elementsItensCart.length-1].split('$')[1];// acessa ultima posição do array e remove o cifrao.
    const priceNumber = parseFloat(priceElement);
    priceTotalNumber += priceNumber;
  })
  return priceTotalNumber.toFixed(2);
}

const updatePriceTotal = (addOrClear) => { 
  const elementoPriceTotal = document.querySelector('.total-price');
  const elementsLiCart = document.querySelectorAll('.cart__item');
  if (addOrClear === undefined){
    elementoPriceTotal.innerText = `preço total: R$0`
  } else {
   console.log(getPriceForElement(elementsLiCart));
    elementoPriceTotal.innerText = `preço total: R$${getPriceForElement(elementsLiCart)}`;
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement(ObjetoParametro, elementoPaiLi) { // segundo parametro é o proprio elemento pai desse elemento, que sera usado para adicionar um addeventlistener 
  const { id: sku, title: name, price: salePrice } = ObjetoParametro;
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', ((event) => { 
    elementoPaiLi.removeChild(event.target);
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
  updatePriceTotal ('add');
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
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${valorBusca}`;
  const ItensResults = await FilterFetch(url, 'results'); // array com todos resultados de acordo com valorBusca 
  ItensResults.forEach((item) => {
    const elementItems = document.querySelector('.items');
    const {
      id,
      title: nameItem,
      thumbnail: ImgItem,
    } = item;
    elementItems.appendChild(createProductItemElement(id, nameItem, ImgItem));
  });
}

function renderClearCartStorage(keyStorage) { // essa função se nao for passado um parametro limpa o carrinho
  const elementOlCart = document.querySelector('.cart__items');
  const itensCart = localStorage.getItem(keyStorage);
  elementOlCart.innerHTML = itensCart;
  const elementsLiCart = document.querySelectorAll('.cart__item');
  elementsLiCart.forEach((element) => {
    element.addEventListener('click', (event) => {
      elementOlCart.removeChild(event.target);
      updateCartStorage(elementOlCart);
      });
  });
  updatePriceTotal();
  updateCartStorage(elementOlCart);
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