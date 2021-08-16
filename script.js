const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
// requisição API para obter os produtos, e dar um json neles!
const getFenchAPI = async () => {
  const resposta = await fetch(endpoint);
  const resultado = await resposta.json();
  return resultado.results;
};
const appenItem = (item) => {
  document.querySelector('.items').appendChild(item);
};
// desestruturo a lista de produtos, e utilizo as chaves que preciso, para criar um novo objeto que só contem elas.
const listOfProducts = async () => {
  const products = await getFenchAPI();
  products.forEach((product) => {
    const { id, title, thumbnail } = product;
    const newProduct = { sku: id, name: title, image: thumbnail };
    // adiciona cada produto como filho de <section class="items">
    appenItem(createProductItemElement(newProduct));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  listOfProducts();
};
