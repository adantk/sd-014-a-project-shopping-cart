let listaItens;

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts(QUERY) {
  const products = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const productsJson = await products.json();
  productsJson.results.forEach((item) => listaItens.appendChild(createProductItemElement(item)));
}

/*
  1- Fazer fetch da URL do Mercado Livre
  2- Armazenar o resultado da busca em uma variável
  3- Transformar resultado em JSON
  4- Mostrar a lista de produtos na tela
*/

window.onload = () => {
  listaItens = document.querySelector('.items');
  console.log(getProducts('computador'));
};
