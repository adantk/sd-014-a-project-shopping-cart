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

function createProductItemElement({
  sku,
  name,
  image,
}) {
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

function cartItemClickListener(event) {}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  console.log('botao ok');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function pageLoad() { // Carrega a página inicial com a pesquisa por computador.
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json().then((dados) => {
      dados.results.forEach((result) => {
        const produto = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(produto));
      });
    }));
}
let subTotal = 0;
function updateSubTotal(price) {
  subTotal += price;
  return subTotal;  
}

function createCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json()).then((dados) => {
      const produto = {
        sku: id,
        name: dados.title,
        salePrice: dados.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(produto));
      updateSubTotal(produto.salePrice);
      console.log(subTotal);
    });
}

const btnAddCart = document.querySelectorAll('.item__add');
// console.log(btnAddCart);
btnAddCart.forEach((btn) => btn.addEventListener('click', () => {
  const id = getSkuFromProductItem(Event.target);
  console.log(id);
  // fetch(`https://api.mercadolibre.com/items/${id}`);
}));

window.onload = () => {
  pageLoad();
  createCart('MLB1341706310');
  createCart('MLB1341706310');
};