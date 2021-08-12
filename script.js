const secaoItens = document.querySelector('.items');
const listaCompras = document.querySelector('.cart__items');

function retornoAPI(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
    .then((r) => r.json())
    .then((r) => r.results);
  }
  return fetch(url)
  .then((r) => r.json());
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function pegaItem(evento) {
  const id = evento.target.parentNode.firstChild.innerText;
  const objeto = await retornoAPI(`https://api.mercadolibre.com/items/${id}`);
  listaCompras.appendChild(createCartItemElement(objeto));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', pegaItem);
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function insereNoDOM() {
  const itens = await retornoAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  itens.forEach((item) => {
    const produto = createProductItemElement(item);
    secaoItens.appendChild(produto);
  });
}
insereNoDOM();

/*  function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

window.onload = () => { };
