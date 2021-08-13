let itemSection;
let pricePlace;
let cartItem;
let clearCart;

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 5 - Calcula o preço
const totalPrice = {
  sum: (price) => {
    pricePlace.innerText = Math.round((Number(pricePlace.innerText) + price) * 100) / 100;
  },
  sub: (price) => {
    pricePlace.innerText = Math.round((Number(pricePlace.innerText) - price) * 100) / 100;
  },
  zero: () => { pricePlace.innerText = '00.00'; },
};

// Requisito 3 - Remove o item clicado no carrinho
function cartItemClickListener(event) {
  // coloque seu código aqui
  totalPrice.sub(Number(event.target.price));
  localStorage.removeItem(event.target.id);
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  // Adiciona o valor e o id direto no item pra facilitar o acesso a informação
  li.id = sku;
  li.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  totalPrice.sum(salePrice);
  return li;
}

// Requisito 6 - Remove todos os itens do carrinho
function clearClickListener(params) {
  const elements = document.getElementsByClassName(params);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  totalPrice.zero();
  localStorage.clear();
}

// Requisito 2 - Função do Event Listener dos botões dos produtos que adiciona o produto clicado ao carinho
async function productClickListener(event) {
  console.log(event.target.parentElement);
  const id = getSkuFromProductItem(event.target.parentElement);
  const resRaw = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const resJson = await resRaw.json();
  cartItem.appendChild(createCartItemElement(resJson));
  localStorage.setItem(id, id);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // Adiciona event listener nos produtos
  btn.addEventListener('click', productClickListener);
  section.appendChild(btn);
  return section;
}

// Requisito 1 - Realiza a pesquisa e coloca na área de itens
async function search(ele) {
  const fetchRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${ele}`);
  const dataJson = await fetchRaw.json();
  dataJson.results.forEach((product) => {
    itemSection.appendChild(createProductItemElement(product));
  });
  itemSection.removeChild(document.querySelector('.loading'));
}

// Requisito 4 - Carrega o local Storage
function loadStorage() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const element = localStorage.getItem(localStorage.key(index));
    fetch(`https://api.mercadolibre.com/items/${element}`)
      .then((res) => res.json())
      .then((e) => document.querySelector('.cart__items').appendChild(createCartItemElement(e)));
    localStorage.setItem(element, element);
  }
}

window.onload = () => {
  itemSection = document.querySelector('.items');
  pricePlace = document.querySelector('.total-price');
  cartItem = document.querySelector('.cart__items');
  clearCart = document.querySelector('.empty-cart');
  clearCart.addEventListener('click', () => clearClickListener('cart__item'));
  loadStorage();
  search('computador');
};
