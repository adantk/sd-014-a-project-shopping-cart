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

function addToCart(event) {
  if (event.target.className === 'item__add') {
    const id = getSkuFromProductItem(event.target.parentElement);
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
}

window.onload = () => {
  pageLoad();
  document.body.addEventListener('click', addToCart);
};