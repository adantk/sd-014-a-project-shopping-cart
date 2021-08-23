const capOlGlobal = '.cart__items';
const capSpanValue = document.querySelector('.total-price');
let capValues = Number(localStorage.getItem('valuesCart'));

function saveCarLocalStorage() {
  const capOl = document.querySelector(capOlGlobal).innerHTML;
  localStorage.setItem('cartItems', capOl);
  localStorage.setItem('valuesCart', capValues);
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
  const capSection = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  capSection.appendChild(section);
  return section;
}
const subtrairValores = (element) => {
 const subtrairTotal = Number(element.innerText.split('$')[1]);
 console.log(subtrairTotal);
 const matheusBolado = Math.round(capValues * 100) / 100;
 capValues = matheusBolado - subtrairTotal;
 capSpanValue.innerText = capValues;
 saveCarLocalStorage();
};

function cartItemClickListener(event) {
  const capOl = document.querySelector(capOlGlobal);
  capOl.removeChild(event.target);
  saveCarLocalStorage();
  subtrairValores(event.target);
}

const prices = (value) => {
  // const capPrices = await fetch(`https://api.mercadolibre.com/items/MLB1790675058`);
  // const apiJson = await capPrices.json();
  // const { price } = apiJson;
  // console.log(price);
  // const capSpanValue = document.querySelector('.total-price');
  
  const matheusBolado = Math.round(capValues * 100) / 100;
  capValues = value + matheusBolado;
  capSpanValue.innerText = capValues;
  // capSpanValue.innerText = capValues;
  saveCarLocalStorage();
};

// função requisito 2 modificada
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  prices(salePrice);
  return li;
}

function listenerItemSaved() {
  const itemSaved = document.querySelectorAll('.cart__item');
  itemSaved.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

// eu fiz
const capFetch = async (item) => {
  const responseMarket = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const armazenaObjeto = await responseMarket.json();
  // eu fiz, captura ol
  const capFatherLi = document.querySelector(capOlGlobal);
  const { id, title, price } = armazenaObjeto;
  capFatherLi.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));
  saveCarLocalStorage();
};

const retornaItems = () => {
  const capOl = document.querySelector(capOlGlobal);
  capOl.innerHTML = localStorage.getItem('cartItems');
  capSpanValue.innerText = localStorage.getItem('valuesCart');
};

function capId() {
  const capButton = document.querySelectorAll('.item__add');
  capButton.forEach((element) => {
    element.addEventListener('click', (marcoPolo) => {
      const capInfoId = marcoPolo.target.parentElement.firstChild.innerText;
      // const capPriceItems = marcoPolo.target.parentElement.firstChild
      capFetch(capInfoId);
    });
  });
}
const createItemsList = async () => {
  const apiMarket = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiJson = await apiMarket.json();
  apiJson.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  });
  capId();
};

// a idéia é criar uma nova requisição para a api, focada no preço, e depois
// linkar com o campo de 'preço total' - ao mesmo tempo em que o item é colocado no carrinho

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const deleteItems = () => {
  const deleteButton = document.querySelector('.empty-cart');
  deleteButton.addEventListener('click', () => {
  const capOls = document.querySelector('.cart__items');
  capOls.innerHTML = '';
  capSpanValue.innerText = 0;
  localStorage.clear();
  });
};

const loading = async () => {
  const capBody = document.querySelector('body');
  const capLoading = document.querySelector('.loading');
  capBody.removeChild(capLoading);
};

window.onload = async () => {
  await createItemsList();
  await loading(); 
  retornaItems();
  listenerItemSaved();
  deleteItems();
};