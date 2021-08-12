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

const getItems = async () => {
  const query = 'computador';
  // const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  const request = await fetch(endpoint);
  const response = await request.json();
  const getResult = response.results;

  const items = document.querySelector('.items');
  getResult.forEach((result) => {
    items.appendChild(createProductItemElement({
      name: result.title,
      sku: result.id,
      image: result.thumbnail,
    }));
  });
};
// Agradeço ao Matheus Martino pela monitoria de revisão do Bloco 9!

window.onload = () => { getItems(); };
