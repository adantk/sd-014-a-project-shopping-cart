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
  const parentElmt = document.querySelector('.items');
  parentElmt.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 5 - Calcula preço
const priceSpan = () => {
  const spPrice = document.createElement('span');
  const cartV = document.querySelector('.cart');
  spPrice.className = 'total-price';
  cartV.appendChild(spPrice);
  spPrice.innerText = '$';
};

const sumValue = () => {
  const cartItem = document.querySelectorAll('.cart__item'); 
  const totalPrice = document.querySelector('.total-price'); 
  let sum = 0;
  cartItem.forEach((product) => {
    const price = (product.innerText).split('$')[1];
    sum += parseFloat(price);
  });
  totalPrice.innerHTML = sum;
};

// Requisito 6 -
function removeItemsList() {
  const btnRemov = document.querySelector('.empty-cart');
  btnRemov.addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    priceSpan();
  });
}

// Requisito 3 - Remove o item clicado no carrinho
function cartItemClickListener(ev) {
  ev.target.remove();
  sumValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2.1  - Chamada da API 
const addProduct = async (id) => {
  const dataRaw = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respJson = await dataRaw.json();
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement({
    sku: respJson.id,
    name: respJson.title,
    salePrice: respJson.price,
  }));
  sumValue();
};

// Requisito 2.2 - Cria o botão
const buttonAdd = () => {
  document.querySelectorAll('.item__add')
  .forEach((button) => 
  button.addEventListener('click', (ev) => 
  addProduct(ev.target.parentElement.firstChild.innerText)));
};

// Requisito 1 - Chamada da API e criação da lista
const endpointProducts = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((product) => product.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  }));
  buttonAdd();
  // const load = document.querySelector('loading');
  // load.remove();
};

window.onload = () => {
  endpointProducts();
  removeItemsList();
  priceSpan();
};