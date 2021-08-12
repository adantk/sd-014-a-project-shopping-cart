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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

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

// Função assíncrona para trazer o array de produtos.
// Primeiramente faço um fetch usando um endpoint,
// depois faço o tratamento da promise, transformando-a
// em um JSON. Por fim, retorno o array de produtos.
const fetchProducts = async () => {
  const request = await fetch(endpoint);
  const response = await request.json();
  const arrOfProducts = response.results;

  return arrOfProducts;
};

/**
 * Função que desestrutura o objeto passado por parâmetro
 * e adiciona à section.items o elemento criado pela função
 * createProductItemElement.
 * @param {object} product Produto contido no arrOfProducts
 */
const createProducts = (product) => {
  const { id: sku, title: name, thumbnail: image } = product;
  document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
};

const addProducts = async () => {
  const arrOfProducts = await fetchProducts();
  arrOfProducts.forEach(createProducts);
};

window.onload = () => {
  fetchProducts();
  addProducts();
};
