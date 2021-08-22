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
  const sectionItems = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sectionItems.appendChild(section);
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

const getAPIProduct = async () => {
  const getAPI = await fetch(('https://api.mercadolibre.com/sites/MLB/search?q=computador')); // Criei uma constante que recebe a API
  const convertAPIJson = await getAPI.json(); // Criei outra constante que faz a conversão da API para .json
  convertAPIJson.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    createProductItemElement({ sku, name, image })); // Faço a busca das informações do array em results e passo como parametro um objeto com id, nome e imagem para a criação do produto
};

window.onload = () => {
  getAPIProduct();
};
