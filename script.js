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

function salvarCarrinho() {
  localStorage.clear();
  localStorage.setItem('Produto', document.querySelector('#Itenscarrinho').innerHTML);
}

function calculateTotalPrice() {
  let valorTotal = 0;
  const favorites = document.querySelectorAll('.cart__item');
  favorites.forEach((el) => {
    const elements = el.innerText;
    const textI = elements.indexOf('$') + 1;
    const numero = Number(elements.substr(textI, elements.length));
    // FONTE: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_number
    valorTotal += numero;
  });
  valorTotal = Math.round(valorTotal * 100) / 100;
  const v = document.querySelector('.total-price');
  v.innerHTML = `${valorTotal}`;
}

function remover(event) {
  document.querySelector('#Itenscarrinho').removeChild(event.target);
  salvarCarrinho();
  calculateTotalPrice();
}

function cartItemClickListener() {
  // coloque seu código aqui
  const compras = document.querySelectorAll('.cart__item');
  compras.forEach((el) => el.addEventListener('click', remover));
}

function carrinho() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('Produto');
  cartItemClickListener();
  calculateTotalPrice();
}

function createCartItemElement({ id: sku, nome: name, valor: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  calculateTotalPrice();
  return li;
}

const emptyCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    document.querySelector('.ol_carrinho').innerHTML = '';
    localStorage.clear();
    calculateTotalPrice();
  });
};

function addItemToCart(ItemId) {
  fetch(`https://api.mercadolibre.com/items/${ItemId}`)
    .then((response) => response.json()
      .then((result) => {
        const {
          id: sku,
          title: name,
          price: salePrice,
        } = result;
        document.querySelector('.cart__items').appendChild(
          createCartItemElement({ id: sku, nome: name, valor: salePrice }),
        );
        cartItemClickListener();
        salvarCarrinho();
        calculateTotalPrice();
      }));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => { addItemToCart(sku); });
  section.appendChild(button);
  return section;
}

const load = document.createElement('p');
const loading = () => {
  load.className = 'loading';
  load.innerText = 'loading...';
  document.querySelector('.container').appendChild(load);
};

const getPromise = async () => {
  const produtos = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador  ');
  const response = await produtos.json();
  document.querySelector('.container').removeChild(load);
  response.results.forEach((result) => {
    document.querySelector('.items').appendChild(createProductItemElement(result));
  });
  carrinho();
};

window.onload = () => {
  loading();
  getPromise();
  emptyCart();
};
