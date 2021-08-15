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

const carrinho = document.querySelector('.cart__items');

const salvarStorage = () => {
  localStorage.removeItem('carrinho');
  localStorage.setItem('carrinho', carrinho.innerHTML);
};

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

const totalPrice = async () => {
  const carItem = document.querySelectorAll('.cart__item');
  let precoTotal = 0;
  carItem.forEach((i) => {
    const preco = i.innerHTML.substr((i.innerHTML.split('').indexOf('$') + 1), i.innerHTML.length);
    precoTotal += parseFloat(preco);
  });
  const price = document.querySelector('.total-price');
  price.innerHTML = '';
  const pricetext = document.createElement('p');
  pricetext.innerHTML = `${precoTotal.toFixed(2)}`;
  if (pricetext.innerHTML.endsWith('.00')) {
    pricetext.innerHTML = `${Math.floor(precoTotal)}`;
    price.appendChild(pricetext);
  } else if (pricetext.innerHTML.endsWith('0')) {
    pricetext.innerHTML = `${precoTotal.toFixed(1)}`;
    price.appendChild(pricetext);
  } else price.appendChild(pricetext);
}; // https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232#:~:text=O%20m%C3%A9todo%20substring()%20retorna,%22%3B%20var%20resultado%20%3D%20stringExemplo. // https://www.horadecodar.com.br/2021/06/27/remover-todos-os-elementos-filhos-com-javascript/ // https://pt.stackoverflow.com/questions/433174/como-pegar-parte-de-uma-string-at%C3%A9-um-caractere-especificado

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
  salvarStorage();
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
}

function deleteAll() {
  const carItem = document.querySelectorAll('.cart__item');
  carItem.forEach((item) => item.remove());
  totalPrice();
  salvarStorage();
}

const deleteButton = document.querySelector('.empty-cart');
deleteButton.addEventListener('click', deleteAll);

function createCartItemElement(item) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${item.id} | NAME: ${item.title} | PRICE: $${item.price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemList = async (computador) => {
  const carrPag = document.querySelector('.loading');
  carrPag.innerText = 'loading...';
  const url = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const urlJson = await url.json();
  carrPag.remove();
  const arrArray = urlJson.results.map((element) => ({
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
  }));
  const items = document.querySelector('.items');
  arrArray.forEach((element) => items.appendChild(createProductItemElement(element)));
};

const addItemCar = async ({ target }) => {
  const itemId = getSkuFromProductItem(target.parentNode);
  const idURL = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const idURLJson = await idURL.json();
  const itemCar = document.querySelector('.cart__items');
  itemCar.appendChild(createCartItemElement(idURLJson));
  totalPrice();
  salvarStorage();
};

const getButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', addItemCar));
};

const carregarStorage = () => {
  carrinho.innerHTML = localStorage.getItem('carrinho');
  const carItem = document.querySelectorAll('.cart__item');
  carItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

window.onload = async () => { 
  await getItemList('computador');
  getButton(); 
  totalPrice();
  carregarStorage();
};
