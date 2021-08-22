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
  sectionItems.appendChild(section)
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

// Faz a busca da API, convertendo em .json e faz a criação do produto
const getAPIProduct = async () => {
  const getAPI = await fetch((`https://api.mercadolibre.com/sites/MLB/search?q=computador`))
  console.log(getAPI);
  const convertAPIJson = await getAPI.json();
  console.log(convertAPIJson);
  convertAPIJson.results.forEach(({id: sku, title: name, thumbnail: image}) => 
  createProductItemElement({sku, name, image}));
  console.log(convertAPIJson);
}

console.log(getAPIProduct());

window.onload = () => {
  getAPIProduct();
};
