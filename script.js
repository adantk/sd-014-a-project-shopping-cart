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

const cartItems = document.querySelector('.cart__items');
// Requisito 4
const funcLocalStorage = () => {
  localStorage.setItem('listaCarrinho', cartItems.innerHTML);
};

const reloadLocalStorage = () => {
  cartItems.innerHTML = localStorage.getItem('listaCarrinho');
  funcLocalStorage(); 
};

// Requisito 3
function cartItemClickListener(event) {
  cartItems.removeChild(event.target);
  funcLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  funcLocalStorage();
  return li;
}

// Requisito 1s
const criaProdutos = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((result) => result.results)
    .then((dados) => {
      const items = document.querySelector('.items');
      dados.map(({ id: sku, title: name, thumbnail: image }) =>
        items.appendChild(createProductItemElement({ sku, name, image })));
    });
};

// Requisito 2
const criaCarrinho = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((object) => {
      createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });
  });
};

const btnCarrinho = () => {
  const buttons = document.querySelectorAll('.item__add'); 
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      return criaCarrinho(id);
    });
  });
};

window.onload = async () => {
  await criaProdutos();
  await btnCarrinho();
  await reloadLocalStorage();
};