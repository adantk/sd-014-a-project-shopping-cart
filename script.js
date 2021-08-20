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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function salvarCarrinho() {
  localStorage.clear();
  localStorage.setItem('Produto', document.querySelector('#Itenscarrinho').innerHTML);
}

function remover(event) {
  document.querySelector('#Itenscarrinho').removeChild(event.target);
  salvarCarrinho();
}

function cartItemClickListener() {
  // coloque seu código aqui
  const compra = document.querySelectorAll('.cart__item');
  compra.forEach((el) => el.addEventListener('click', remover));
}

function carrinho() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('Produto');
  cartItemClickListener();
}

function createCartItemElement({ id: sku, nome: name, valor: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

const getPromise = async () => {
  const produtos = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await produtos.json();

  response.results.forEach((result) => {
    document.querySelector('.items').appendChild(createProductItemElement(result));
  });
  carrinho();
};

window.onload = () => {
  getPromise();
 };
